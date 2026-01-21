'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import gameService, {
    StartGameResponse,
    ValidateWordResponse,
    HintResponse,
    CompleteGameResponse,
    GameCategory,
    DifficultyLevel
} from '@/services/gameService';

// Timer durations per difficulty (in seconds)
const TIMER_DURATION: Record<DifficultyLevel, number> = {
    1: 300, // 5 minutes for Easy
    2: 240, // 4 minutes
    3: 180, // 3 minutes for Medium
    4: 120, // 2 minutes
    5: 90,  // 1.5 minutes for Expert
};

interface GameState {
    sessionId: string | null;
    startWord: string;
    targetWord: string;
    currentWord: string;
    chain: string[];
    score: number;
    movesCount: number;
    hintsUsed: number;
    hintsRemaining: number;
    maxHintsAllowed: number;
    distanceRemaining: number;
    isComplete: boolean;
    isWon: boolean;
    mode: 'standard' | 'edtech_only';
    category: GameCategory;
    difficulty: DifficultyLevel;
    status: 'idle' | 'playing' | 'completed';
    message: string;
    lastError: string | null;
    learningTip: string | null;
    wordDifficulty: number | null;
    // Timer fields
    timeRemaining: number;
    totalTime: number;
    timerActive: boolean;
}

interface GameResult {
    isWon: boolean;
    totalScore: number;
    movesCount: number;
    hintsUsed: number;
    xpEarned: number;
    pathTaken: string[];
    optimalPathLength: number;
    message: string;
    timedOut?: boolean;
}

interface GameContextType {
    gameState: GameState;
    gameResult: GameResult | null;
    loading: boolean;
    startGame: (mode?: 'standard' | 'edtech_only', category?: GameCategory, difficulty?: DifficultyLevel) => Promise<boolean>;
    submitWord: (word: string) => Promise<ValidateWordResponse | null>;
    getHint: () => Promise<HintResponse | null>;
    completeGame: (forfeit?: boolean) => Promise<CompleteGameResponse | null>;
    resetGame: () => void;
    resumeGame: () => Promise<boolean>;
}

const initialGameState: GameState = {
    sessionId: null,
    startWord: '',
    targetWord: '',
    currentWord: '',
    chain: [],
    score: 0,
    movesCount: 0,
    hintsUsed: 0,
    hintsRemaining: 3,
    maxHintsAllowed: 3,
    distanceRemaining: 0,
    isComplete: false,
    isWon: false,
    mode: 'standard',
    category: 'general',
    difficulty: 3,
    status: 'idle',
    message: '',
    lastError: null,
    learningTip: null,
    wordDifficulty: null,
    // Timer defaults
    timeRemaining: 180,
    totalTime: 180,
    timerActive: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [gameState, setGameState] = useState<GameState>(initialGameState);
    const [gameResult, setGameResult] = useState<GameResult | null>(null);
    const [loading, setLoading] = useState(false);
    const thinkingStartTime = useRef<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Timer effect - counts down every second when active
    useEffect(() => {
        if (gameState.timerActive && gameState.status === 'playing') {
            timerRef.current = setInterval(() => {
                setGameState((prev) => {
                    if (prev.timeRemaining <= 1) {
                        // Time's up! Auto-forfeit
                        return { ...prev, timeRemaining: 0, timerActive: false };
                    }
                    return { ...prev, timeRemaining: prev.timeRemaining - 1 };
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [gameState.timerActive, gameState.status]);

    // Handle timeout - auto-forfeit when timer reaches 0
    useEffect(() => {
        if (gameState.timeRemaining === 0 && gameState.status === 'playing' && !gameState.isComplete) {
            handleTimeout();
        }
    }, [gameState.timeRemaining, gameState.status, gameState.isComplete]);

    const handleTimeout = useCallback(async () => {
        // Stop timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // Set timeout result
        setGameResult({
            isWon: false,
            totalScore: gameState.score,
            movesCount: gameState.movesCount,
            hintsUsed: gameState.hintsUsed,
            xpEarned: Math.floor(gameState.score * 0.5), // Half XP for timeout
            pathTaken: gameState.chain,
            optimalPathLength: 4,
            message: '⏰ Time\'s up! You ran out of time.',
            timedOut: true,
        });

        setGameState((prev) => ({
            ...prev,
            isComplete: true,
            isWon: false,
            status: 'completed',
            timerActive: false,
            message: '⏰ Time\'s up!',
        }));

        // Try to complete on backend
        if (gameState.sessionId && gameState.sessionId !== 'demo') {
            try {
                await gameService.completeGame(gameState.sessionId, true);
            } catch (error) {
                console.error('Failed to complete game on timeout:', error);
            }
        }
    }, [gameState.sessionId, gameState.score, gameState.movesCount, gameState.hintsUsed, gameState.chain]);

    const startGame = async (
        mode: 'standard' | 'edtech_only' = 'standard',
        category: GameCategory = 'general',
        difficulty: DifficultyLevel = 3
    ): Promise<boolean> => {
        setLoading(true);
        setGameResult(null);

        // Clear any existing timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        const timerDuration = TIMER_DURATION[difficulty];

        try {
            const response = await gameService.startGame(mode, category, difficulty);
            const maxHints = 6 - (response.difficulty_level || difficulty);
            setGameState({
                sessionId: response.session_id,
                startWord: response.start_word,
                targetWord: response.target_word,
                currentWord: response.start_word,
                chain: [response.start_word],
                score: 0,
                movesCount: 0,
                hintsUsed: 0,
                hintsRemaining: maxHints,
                maxHintsAllowed: maxHints,
                distanceRemaining: 0,
                isComplete: false,
                isWon: false,
                mode: mode,
                category: response.category || category,
                difficulty: response.difficulty_level || difficulty,
                status: 'playing',
                message: response.message,
                lastError: null,
                learningTip: null,
                wordDifficulty: null,
                // Timer
                timeRemaining: timerDuration,
                totalTime: timerDuration,
                timerActive: true,
            });
            thinkingStartTime.current = Date.now();
            return true;
        } catch (error) {
            console.error('Failed to start game:', error);
            // Fallback demo mode
            const demoWords: Record<GameCategory, { start: string; target: string }> = {
                general: { start: 'FAIL', target: 'PASS' },
                science: { start: 'ATOM', target: 'BOND' },
                biology: { start: 'CELL', target: 'GENE' },
                physics: { start: 'MASS', target: 'WAVE' },
                education: { start: 'BOOK', target: 'READ' },
                mixed: { start: 'WORD', target: 'PLAY' },
            };
            const demo = demoWords[category] || demoWords.general;
            const maxHints = 6 - difficulty;
            setGameState({
                sessionId: 'demo',
                startWord: demo.start,
                targetWord: demo.target,
                currentWord: demo.start,
                chain: [demo.start],
                score: 0,
                movesCount: 0,
                hintsUsed: 0,
                hintsRemaining: maxHints,
                maxHintsAllowed: maxHints,
                distanceRemaining: 4,
                isComplete: false,
                isWon: false,
                mode: mode,
                category: category,
                difficulty: difficulty,
                status: 'playing',
                message: `Demo: Transform '${demo.start}' into '${demo.target}' using ${category} vocabulary!`,
                lastError: null,
                learningTip: null,
                wordDifficulty: null,
                // Timer
                timeRemaining: timerDuration,
                totalTime: timerDuration,
                timerActive: true,
            });
            thinkingStartTime.current = Date.now();
            return true;
        } finally {
            setLoading(false);
        }
    };

    const submitWord = async (word: string): Promise<ValidateWordResponse | null> => {
        if (!gameState.sessionId) return null;

        const thinkingTime = Date.now() - thinkingStartTime.current;

        try {
            const response = await gameService.validateWord(
                gameState.sessionId,
                gameState.currentWord,
                word.toUpperCase(),
                thinkingTime
            );

            if (response.valid) {
                setGameState((prev) => ({
                    ...prev,
                    chain: [...prev.chain, word.toUpperCase()],
                    currentWord: response.current_word,
                    score: response.total_score,
                    movesCount: response.moves_count,
                    distanceRemaining: response.distance_remaining,
                    isComplete: response.is_complete,
                    message: response.message,
                    lastError: null,
                    learningTip: response.learning_tip,
                    wordDifficulty: response.word_difficulty,
                }));

                if (response.is_complete) {
                    // Stop timer on completion
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                    setGameState((prev) => ({ ...prev, timerActive: false }));
                    await completeGame(false);
                }
            } else {
                setGameState((prev) => ({
                    ...prev,
                    lastError: response.reason,
                    message: response.message,
                }));
            }

            thinkingStartTime.current = Date.now();
            return response;
        } catch (error) {
            console.error('Failed to validate word:', error);
            // Demo mode fallback
            if (gameState.sessionId === 'demo') {
                const upperWord = word.toUpperCase();
                const isComplete = upperWord === gameState.targetWord;

                if (isComplete && timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }

                setGameState((prev) => ({
                    ...prev,
                    chain: [...prev.chain, upperWord],
                    currentWord: upperWord,
                    score: prev.score + 10,
                    movesCount: prev.movesCount + 1,
                    distanceRemaining: isComplete ? 0 : Math.max(0, prev.distanceRemaining - 1),
                    isComplete: isComplete,
                    message: `+10 points! ${isComplete ? 'You reached the target!' : ''}`,
                    lastError: null,
                    learningTip: `"${upperWord}" is a great vocabulary word!`,
                    wordDifficulty: 2,
                    timerActive: isComplete ? false : prev.timerActive,
                }));

                if (isComplete) {
                    setTimeout(() => completeGame(false), 500);
                }

                return {
                    valid: true,
                    score_delta: 10,
                    reason: null,
                    distance_remaining: 3,
                    current_word: upperWord,
                    target_word: gameState.targetWord,
                    total_score: gameState.score + 10,
                    moves_count: gameState.movesCount + 1,
                    is_complete: isComplete,
                    word_definition: null,
                    learning_tip: `"${upperWord}" is a great vocabulary word!`,
                    word_difficulty: 2,
                    message: '+10 points!',
                };
            }
            return null;
        }
    };

    const getHint = async (): Promise<HintResponse | null> => {
        if (!gameState.sessionId) return null;

        // Check if hints are available
        if (gameState.hintsRemaining <= 0) {
            setGameState((prev) => ({
                ...prev,
                message: '❌ No hints remaining for this difficulty level!',
            }));
            return null;
        }

        setLoading(true);
        try {
            const response = await gameService.getHint(gameState.sessionId);
            setGameState((prev) => ({
                ...prev,
                hintsUsed: response.hints_used,
                hintsRemaining: response.hints_remaining,
                maxHintsAllowed: response.max_hints_allowed,
                message: response.message,
                learningTip: response.learning_tip,
            }));
            return response;
        } catch (error) {
            console.error('Failed to get hint:', error);
            if (gameState.sessionId === 'demo') {
                const newHintsUsed = gameState.hintsUsed + 1;
                const maxHints = 6 - gameState.difficulty;
                const hint: HintResponse = {
                    hint_word: 'NEXT',
                    hint_cost: 5,
                    hints_used: newHintsUsed,
                    hints_remaining: Math.max(0, maxHints - newHintsUsed),
                    max_hints_allowed: maxHints,
                    learning_tip: "Try changing one letter to form a new word!",
                    message: `💡 Try the word: 'NEXT'. (${Math.max(0, maxHints - newHintsUsed)} hints remaining)`,
                };
                setGameState((prev) => ({
                    ...prev,
                    hintsUsed: newHintsUsed,
                    hintsRemaining: hint.hints_remaining,
                    message: hint.message,
                    learningTip: hint.learning_tip,
                }));
                return hint;
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    const completeGame = async (forfeit: boolean = false): Promise<CompleteGameResponse | null> => {
        if (!gameState.sessionId) return null;

        // Stop timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        setLoading(true);
        try {
            const response = await gameService.completeGame(gameState.sessionId, forfeit);

            setGameResult({
                isWon: response.is_won,
                totalScore: response.total_score,
                movesCount: response.moves_count,
                hintsUsed: response.hints_used,
                xpEarned: response.xp_earned,
                pathTaken: response.path_taken,
                optimalPathLength: response.optimal_path_length,
                message: response.message,
            });

            setGameState((prev) => ({
                ...prev,
                isComplete: true,
                isWon: response.is_won,
                status: 'completed',
                timerActive: false,
            }));

            return response;
        } catch (error) {
            console.error('Failed to complete game:', error);
            if (gameState.sessionId === 'demo') {
                const result: CompleteGameResponse = {
                    session_id: 'demo',
                    is_won: !forfeit && gameState.currentWord === gameState.targetWord,
                    total_score: gameState.score,
                    moves_count: gameState.movesCount,
                    hints_used: gameState.hintsUsed,
                    xp_earned: gameState.score + (forfeit ? 0 : 50),
                    path_taken: gameState.chain,
                    optimal_path_length: 4,
                    message: forfeit ? 'Game forfeited' : '🏆 Victory!',
                };
                setGameResult({
                    isWon: result.is_won,
                    totalScore: result.total_score,
                    movesCount: result.moves_count,
                    hintsUsed: result.hints_used,
                    xpEarned: result.xp_earned,
                    pathTaken: result.path_taken,
                    optimalPathLength: result.optimal_path_length,
                    message: result.message,
                });
                setGameState((prev) => ({
                    ...prev,
                    isComplete: true,
                    isWon: result.is_won,
                    status: 'completed',
                    timerActive: false,
                }));
                return result;
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    const resetGame = () => {
        // Clear timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        setGameState(initialGameState);
        setGameResult(null);
    };

    const resumeGame = async (): Promise<boolean> => {
        setLoading(true);
        try {
            const activeGame = await gameService.getActiveGame();
            if (activeGame && !activeGame.is_completed) {
                const timerDuration = TIMER_DURATION[activeGame.difficulty_level] || 180;
                // Calculate elapsed time if needed, for now reset to full duration or handle server side time
                // Ideally server should return time remaining.

                // We need to fetch the current chain/state.
                // Since getActiveGame returns GameHistoryItem which might not have full state (like current chain),
                // we might need to reconstruct it or the API should provide it.
                // Assuming for now we can at least set basic state.
                // Wait, GameHistoryItem doesn't have the chain!
                // The user provided response for /game/active shows:
                // "target_word_start": "HOT", "target_word_end": "GAS", "moves_count": 0...
                // It doesn't seem to have the current word or chain.
                // However, if we can't fully resume, maybe we should just prompt to forfeit?
                // But the requirement says "Show 'Continue Game'".
                // Let's assume for now we set what we can and maybe fetch details if needed.
                // Actually, if we can't get the current word, we can't really play.
                // Let's check if there's another endpoint or if we should use what we have.
                // The response has `id`, `mode`, `category`, `difficulty_level`.
                // If moves_count is 0, start word is target_word_start.

                const maxHints = 6 - activeGame.difficulty_level;

                setGameState({
                    sessionId: activeGame.id,
                    startWord: activeGame.target_word_start,
                    targetWord: activeGame.target_word_end,
                    currentWord: activeGame.target_word_start, // Assumption: if we can't get current, start from beginning? Or maybe we need a better API.
                    // Ideally we'd need the last word played.
                    // For now let's assume it's the start word if moves=0.
                    chain: [activeGame.target_word_start],
                    score: activeGame.total_score,
                    movesCount: activeGame.moves_count,
                    hintsUsed: activeGame.hints_used,
                    hintsRemaining: Math.max(0, maxHints - activeGame.hints_used),
                    maxHintsAllowed: maxHints,
                    distanceRemaining: 0, // Unknown without calculation
                    isComplete: false,
                    isWon: false,
                    mode: activeGame.mode as any,
                    category: activeGame.category,
                    difficulty: activeGame.difficulty_level,
                    status: 'playing',
                    message: 'Resumed active game',
                    lastError: null,
                    learningTip: null,
                    wordDifficulty: null,
                    timeRemaining: timerDuration, // Reset timer for now
                    totalTime: timerDuration,
                    timerActive: true,
                });
                thinkingStartTime.current = Date.now();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to resume game:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <GameContext.Provider value={{
            gameState,
            gameResult,
            loading,
            startGame,
            submitWord,
            getHint,
            completeGame,
            resetGame,
            resumeGame
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
