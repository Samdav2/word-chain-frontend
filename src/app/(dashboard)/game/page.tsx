'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { GameCategory, DifficultyLevel } from '@/services/gameService';
import gameService from '@/services/gameService';
import { explainWord, WordExplanation } from '@/services/aiService';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Lightbulb, Send, Target, Trophy, Flame,
    X, ChevronRight, Zap, AlertCircle, CheckCircle,
    ArrowLeft, RotateCcw, BookOpen, Sparkles, Brain,
    Beaker, Dna, Atom, GraduationCap, Shuffle, Timer
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Floating words for background
const FLOATING_WORDS = ['ATOM', 'CELL', 'GENE', 'WAVE', 'BOND', 'MASS', 'WORD', 'PLAY', 'BOOK', 'READ', 'FAIL', 'PASS'];

// Category icons and colors
const CATEGORY_CONFIG: Record<GameCategory, { icon: React.ReactNode; color: string; label: string }> = {
    general: { icon: <Shuffle className="w-5 h-5" />, color: '#888888', label: 'General' },
    science: { icon: <Beaker className="w-5 h-5" />, color: '#22c55e', label: 'Science' },
    biology: { icon: <Dna className="w-5 h-5" />, color: '#ec4899', label: 'Biology' },
    physics: { icon: <Atom className="w-5 h-5" />, color: '#3b82f6', label: 'Physics' },
    education: { icon: <GraduationCap className="w-5 h-5" />, color: '#f59e0b', label: 'Education' },
    mixed: { icon: <Sparkles className="w-5 h-5" />, color: '#ff7b00', label: 'Mixed' },
};

// Spark particle component
function SparkParticle({ x, y, delay }: { x: number; y: number; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{
                opacity: 0,
                scale: 0,
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
            }}
            transition={{ duration: 0.6, delay }}
            className="absolute w-2 h-2 rounded-full bg-[#ff7b00]"
            style={{ left: x, top: y }}
        />
    );
}

// Floating word component
function FloatingWord({ word, index }: { word: string; index: number }) {
    const randomX = 5 + (index * 8) % 90;
    const randomDuration = 15 + (index % 5) * 3;
    const randomDelay = index * 2;

    return (
        <motion.div
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ y: '-100px', opacity: 0.15 }}
            transition={{
                duration: randomDuration,
                delay: randomDelay,
                repeat: Infinity,
                ease: 'linear'
            }}
            className="absolute text-white/10 font-bold text-2xl pointer-events-none select-none"
            style={{ left: `${randomX}%` }}
        >
            {word}
        </motion.div>
    );
}

// Confetti component for victory
function Confetti() {
    const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: ['#ff3d3d', '#ff7b00', '#22c55e', '#3b82f6', '#ffd700'][i % 5],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ y: -20, x: `${p.x}vw`, rotate: 0, opacity: 1 }}
                    animate={{ y: '100vh', rotate: 360, opacity: 0 }}
                    transition={{ duration: p.duration, delay: p.delay, ease: 'linear' }}
                    className="absolute w-3 h-3 rounded-sm"
                    style={{ backgroundColor: p.color }}
                />
            ))}
        </div>
    );
}

export default function GameArenaPage() {
    const { gameState, gameResult, loading, startGame, submitWord, getHint, completeGame, resetGame } = useGame();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    // UI State
    const [inputWord, setInputWord] = useState('');
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'hint' | 'tip' } | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [showSparks, setShowSparks] = useState(false);
    const [sparkPosition, setSparkPosition] = useState({ x: 0, y: 0 });
    const [showConfetti, setShowConfetti] = useState(false);

    // Game setup state
    const [selectedCategory, setSelectedCategory] = useState<GameCategory>('general');
    const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(3);

    // AI explanation state
    const [showAIModal, setShowAIModal] = useState(false);
    const [aiExplanation, setAIExplanation] = useState<WordExplanation | null>(null);
    const [aiLoading, setAILoading] = useState(false);
    const [selectedWordForAI, setSelectedWordForAI] = useState('');

    // Active game state
    const [showActiveGameModal, setShowActiveGameModal] = useState(false);
    const { resumeGame } = useGame();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    // Check for active game on mount
    useEffect(() => {
        const checkActiveGame = async () => {
            if (isAuthenticated && gameState.status === 'idle') {
                const hasActive = await resumeGame();
                if (hasActive) {
                    setShowActiveGameModal(true);
                }
            }
        };
        checkActiveGame();
    }, [isAuthenticated, gameState.status]); // Removed resumeGame from deps to avoid loop if stable

    useEffect(() => {
        if (gameResult) {
            setShowResult(true);
            if (gameResult.isWon) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 4000);
            }
        }
    }, [gameResult]);

    const handleStartGame = async () => {
        await startGame('standard', selectedCategory, selectedDifficulty);
    };

    const triggerSparks = useCallback((e: React.MouseEvent) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setSparkPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        setShowSparks(true);
        setTimeout(() => setShowSparks(false), 700);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputWord.trim() || loading) return;

        const result = await submitWord(inputWord);
        if (result) {
            if (result.valid) {
                triggerSparks(e as unknown as React.MouseEvent);
                setFeedback({ message: result.message, type: 'success' });
                setInputWord('');

                // Show learning tip if available
                if (result.learning_tip) {
                    setTimeout(() => {
                        setFeedback({ message: result.learning_tip!, type: 'tip' });
                    }, 1500);
                }
            } else {
                setFeedback({ message: result.message, type: 'error' });
            }
        }
        setTimeout(() => setFeedback(null), 4000);
    };

    const handleHint = async () => {
        if (loading) return;
        const hint = await getHint();
        if (hint) {
            setFeedback({ message: hint.message, type: 'hint' });
            setTimeout(() => setFeedback(null), 5000);
        }
    };

    const handleForfeit = async () => {
        await completeGame(true);
    };

    const handleAskAI = async (word: string) => {
        setSelectedWordForAI(word);
        setShowAIModal(true);
        setAILoading(true);

        try {
            // First try to get definition from backend
            const wordInfo = await gameService.getWordInfo(word);
            if (wordInfo && wordInfo.definition) {
                setAIExplanation({
                    word: wordInfo.word,
                    definition: wordInfo.definition,
                    pronunciation: wordInfo.pronunciation || undefined,
                    partOfSpeech: wordInfo.part_of_speech || 'noun',
                    examples: wordInfo.examples || [],
                    etymology: wordInfo.etymology || undefined,
                    funFact: wordInfo.learning_tip || undefined,
                });
            } else {
                // Fallback to AI service
                const explanation = await explainWord(word);
                setAIExplanation(explanation);
            }
        } catch (error) {
            console.error('Word info failed, trying AI:', error);
            try {
                const explanation = await explainWord(word);
                setAIExplanation(explanation);
            } catch (aiError) {
                console.error('AI explanation also failed:', aiError);
            }
        } finally {
            setAILoading(false);
        }
    };

    const handlePlayAgain = () => {
        setShowResult(false);
        resetGame();
    };

    const handleBackToDashboard = () => {
        resetGame();
        router.push('/dashboard');
    };

    if (authLoading) {
        return (
            <div className="gamistic-theme gamistic-container min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    const categoryConfig = CATEGORY_CONFIG[gameState.category];

    return (
        <div className="gamistic-theme gamistic-container min-h-screen p-2 sm:p-4 md:p-6 relative overflow-hidden">
            {/* Floating Background Words */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {FLOATING_WORDS.map((word, i) => (
                    <FloatingWord key={word} word={word} index={i} />
                ))}
            </div>

            {/* Spark Effects */}
            <AnimatePresence>
                {showSparks && (
                    <div className="fixed inset-0 pointer-events-none z-50">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <SparkParticle key={i} x={sparkPosition.x} y={sparkPosition.y} delay={i * 0.03} />
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Confetti on Win */}
            {showConfetti && <Confetti />}

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-3 sm:mb-6">
                    <Link href="/dashboard" className="flex items-center gap-1 sm:gap-2 text-[#888888] hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Back</span>
                    </Link>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff7b00]" />
                        <span className="font-bold text-white text-sm sm:text-base">WordChain<span className="text-[#ff7b00]">Pro</span></span>
                    </div>
                </div>

                {/* Game Not Started - Category/Difficulty Selection */}
                {gameState.status === 'idle' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-3 sm:space-y-6"
                    >
                        <div className="gamer-card text-center py-4 sm:py-8 p-3 sm:p-6">
                            <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-6 rounded-full bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00] flex items-center justify-center">
                                <Target className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                            </div>
                            <h2 className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">New Game</h2>
                            <p className="text-[#888888] text-sm sm:text-base">Choose your category and difficulty</p>
                        </div>

                        {/* Category Selection */}
                        <div className="gamer-card p-3 sm:p-6">
                            <h3 className="text-sm sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff7b00]" />
                                Select Category
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
                                {(Object.keys(CATEGORY_CONFIG) as GameCategory[]).map((cat) => {
                                    const config = CATEGORY_CONFIG[cat];
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`p-2 sm:p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-1 sm:gap-2 ${selectedCategory === cat
                                                ? 'border-[#ff7b00] bg-[#ff7b00]/10'
                                                : 'border-[#2a2a2a] hover:border-[#3a3a3a] bg-[#1a1a1a]'
                                                }`}
                                        >
                                            <div style={{ color: config.color }} className="[&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5">{config.icon}</div>
                                            <span className="text-white font-medium text-[10px] sm:text-sm">{config.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Difficulty Selection */}
                        <div className="gamer-card p-3 sm:p-6">
                            <h3 className="text-sm sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff3d3d]" />
                                Difficulty
                            </h3>
                            <div className="flex gap-2 sm:gap-3">
                                {([1, 2, 3, 4, 5] as DifficultyLevel[]).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setSelectedDifficulty(level)}
                                        className={`flex-1 py-2 sm:py-3 rounded-lg border-2 transition-all font-bold text-sm sm:text-base ${selectedDifficulty === level
                                            ? 'border-[#ff7b00] bg-[#ff7b00]/10 text-[#ff7b00]'
                                            : 'border-[#2a2a2a] hover:border-[#3a3a3a] bg-[#1a1a1a] text-white'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] sm:text-xs text-[#888888] mt-2 text-center">
                                1 = Easy • 5 = Expert
                            </p>
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={handleStartGame}
                            disabled={loading}
                            className="bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00] text-white font-bold rounded-lg shadow-lg w-full flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-lg py-3 sm:py-4"
                        >
                            <Play className="w-5 h-5 sm:w-6 sm:h-6" fill="white" />
                            {loading ? 'Starting...' : 'START GAME'}
                        </button>

                    </motion.div>
                )}

                {/* Game Playing */}
                {gameState.status === 'playing' && (
                    <div className="space-y-3 sm:space-y-6">
                        {/* Target Display with Category Badge */}
                        <div className="gamer-card p-3 sm:p-6">
                            <div className="flex flex-col gap-3 sm:gap-4">
                                {/* Target words and badges */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <span
                                            className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 [&>svg]:w-3 [&>svg]:h-3 sm:[&>svg]:w-4 sm:[&>svg]:h-4"
                                            style={{ backgroundColor: `${categoryConfig.color}20`, color: categoryConfig.color }}
                                        >
                                            {categoryConfig.icon}
                                            <span className="hidden sm:inline">{categoryConfig.label}</span>
                                        </span>
                                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-[#2a2a2a] text-[10px] sm:text-xs text-white">
                                            Lvl {gameState.difficulty}
                                        </span>
                                    </div>
                                    {/* Stats row for mobile */}
                                    <div className="flex items-center gap-3 sm:gap-6">
                                        {/* Timer Display */}
                                        <div className="text-center">
                                            <p className="text-[9px] sm:text-xs text-[#888888]">Time</p>
                                            <div className={`text-sm sm:text-2xl font-bold flex items-center gap-0.5 sm:gap-1 ${gameState.timeRemaining <= 30
                                                ? 'text-[#ff3d3d] animate-pulse'
                                                : gameState.timeRemaining <= 60
                                                    ? 'text-[#ff7b00]'
                                                    : 'text-white'
                                                }`}>
                                                <Timer className="w-3 h-3 sm:w-5 sm:h-5" />
                                                {Math.floor(gameState.timeRemaining / 60)}:{(gameState.timeRemaining % 60).toString().padStart(2, '0')}
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[9px] sm:text-xs text-[#888888]">Score</p>
                                            <p className="text-sm sm:text-2xl font-bold glow-text-orange">{gameState.score}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[9px] sm:text-xs text-[#888888]">Moves</p>
                                            <p className="text-sm sm:text-2xl font-bold text-white">{gameState.movesCount}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Word targets */}
                                <div className="flex items-center justify-center gap-2 sm:gap-3">
                                    <span className="text-lg sm:text-2xl font-black text-[#ff3d3d]">{gameState.startWord}</span>
                                    <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-[#888888]" />
                                    <span className="text-lg sm:text-2xl font-black text-green-500">{gameState.targetWord}</span>
                                </div>
                            </div>
                        </div>

                        {/* Word Chain */}
                        <div className="gamer-card p-3 sm:p-6 min-h-[120px] sm:min-h-[180px]">
                            <div className="flex items-center justify-between mb-2 sm:mb-4">
                                <h3 className="text-xs sm:text-sm text-[#888888]">Your Chain</h3>
                                {gameState.distanceRemaining > 0 && (
                                    <span className="text-[10px] sm:text-xs text-[#ff7b00]">{gameState.distanceRemaining} steps</span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
                                {gameState.chain.map((word, index) => (
                                    <React.Fragment key={`${word}-${index}`}>
                                        <motion.button
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => handleAskAI(word)}
                                            className={`px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full font-bold text-xs sm:text-lg cursor-pointer transition-all ${index === 0
                                                ? 'bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00] text-white'
                                                : index === gameState.chain.length - 1
                                                    ? 'bg-[#ff7b00] text-white ring-2 ring-[#ff7b00]/50'
                                                    : 'bg-[#2a2a2a] text-white border border-[#3a3a3a] hover:border-[#ff7b00]'
                                                }`}
                                            title="Click to learn about this word"
                                        >
                                            {word}
                                        </motion.button>
                                        {index < gameState.chain.length - 1 && (
                                            <ChevronRight className="w-3 h-3 sm:w-5 sm:h-5 text-[#666666]" />
                                        )}
                                    </React.Fragment>
                                ))}
                                <ChevronRight className="w-3 h-3 sm:w-5 sm:h-5 text-[#666666]" />
                                <div className="px-2.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full border-2 border-dashed border-[#3a3a3a] text-[#666666] font-bold text-xs sm:text-base">
                                    ???
                                </div>
                            </div>
                        </div>

                        {/* Learning Tip */}
                        <AnimatePresence>
                            {gameState.learningTip && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-[#ff7b00]/10 border border-[#ff7b00]/30 p-4 rounded-lg flex items-start gap-3"
                                >
                                    <Brain className="w-5 h-5 text-[#ff7b00] flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-[#ff7b00]">{gameState.learningTip}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Feedback */}
                        <AnimatePresence mode="wait">
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`p-4 rounded-lg flex items-center gap-3 ${feedback.type === 'success'
                                        ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                                        : feedback.type === 'error'
                                            ? 'bg-[#ff3d3d]/10 border border-[#ff3d3d]/30 text-[#ff3d3d]'
                                            : feedback.type === 'tip'
                                                ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                                                : 'bg-[#ff7b00]/10 border border-[#ff7b00]/30 text-[#ff7b00]'
                                        }`}
                                >
                                    {feedback.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                                        feedback.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
                                            feedback.type === 'tip' ? <Brain className="w-5 h-5" /> :
                                                <Lightbulb className="w-5 h-5" />}
                                    {feedback.message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Input Area */}
                        <div className="gamer-card p-3 sm:p-6">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:gap-4">
                                <input
                                    type="text"
                                    value={inputWord}
                                    onChange={(e) => setInputWord(e.target.value.toUpperCase())}
                                    placeholder="Enter next word..."
                                    disabled={loading}
                                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm sm:text-lg font-bold uppercase tracking-wider placeholder-[#666666] focus:border-[#ff7b00] focus:outline-none transition-colors"
                                    autoFocus
                                />
                                <div className="flex gap-2 sm:gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading || !inputWord.trim()}
                                        className="flex-1 bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00] text-white font-bold rounded-lg py-2.5 sm:py-3 flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 text-xs sm:text-sm"
                                    >
                                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                        SUBMIT
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleHint}
                                        disabled={loading || gameState.hintsRemaining <= 0}
                                        className={`flex-1 sm:flex-none px-3 sm:px-6 py-2.5 sm:py-3 bg-[#1a1a1a] border rounded-lg font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-colors disabled:opacity-50 text-xs sm:text-sm ${gameState.hintsRemaining > 0
                                            ? 'border-[#ff7b00]/30 text-[#ff7b00] hover:bg-[#ff7b00]/10'
                                            : 'border-[#666666]/30 text-[#666666]'}`}
                                    >
                                        <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="hidden sm:inline">HINT</span> ({gameState.hintsRemaining})
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Forfeit */}
                        <div className="text-center">
                            <button
                                onClick={handleForfeit}
                                className="text-[#888888] hover:text-[#ff3d3d] transition-colors text-xs sm:text-sm"
                            >
                                Give up and see solution
                            </button>
                        </div>
                    </div>
                )}

                {/* Result Modal */}
                <AnimatePresence>
                    {showResult && gameResult && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-40"
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="gamer-card p-8 max-w-lg w-full text-center relative"
                            >
                                <button onClick={() => setShowResult(false)} className="absolute top-4 right-4 text-[#888888] hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>

                                <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${gameResult.isWon ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00]'
                                    }`}>
                                    {gameResult.isWon ? <Trophy className="w-12 h-12 text-white" /> : <Target className="w-12 h-12 text-white" />}
                                </div>

                                <h2 className={`text-3xl font-black mb-2 ${gameResult.isWon ? 'text-green-400' : 'text-[#ff3d3d]'}`}>
                                    {gameResult.isWon ? '🏆 VICTORY!' : 'Game Over'}
                                </h2>

                                <div className="grid grid-cols-2 gap-4 my-6">
                                    <div className="bg-[#0a0a0a] p-4 rounded-lg">
                                        <p className="text-xs text-[#888888]">XP Earned</p>
                                        <p className="text-2xl font-bold glow-text-orange">+{gameResult.xpEarned}</p>
                                    </div>
                                    <div className="bg-[#0a0a0a] p-4 rounded-lg">
                                        <p className="text-xs text-[#888888]">Moves</p>
                                        <p className="text-2xl font-bold text-white">{gameResult.movesCount}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button onClick={handlePlayAgain} className="gamer-btn-primary flex-1 flex items-center justify-center gap-2">
                                        <RotateCcw className="w-5 h-5" />
                                        Play Again
                                    </button>
                                    <button onClick={handleBackToDashboard} className="flex-1 px-6 py-3 bg-[#2a2a2a] text-white rounded-lg font-bold hover:bg-[#3a3a3a]">
                                        Dashboard
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* AI Explanation Modal */}
                <AnimatePresence>
                    {showAIModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 flex items-center justify-center p-2 sm:p-4 z-50"
                            onClick={() => setShowAIModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="gamer-card p-4 sm:p-6 w-full max-w-md max-h-[85vh] overflow-y-auto relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setShowAIModal(false)}
                                    className="absolute top-2 right-2 sm:top-4 sm:right-4 text-[#888888] hover:text-white p-1 bg-[#2a2a2a] rounded-full"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>

                                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pr-8">
                                    <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff7b00]" />
                                    <h3 className="text-lg sm:text-xl font-bold text-white">{selectedWordForAI}</h3>
                                </div>

                                {aiLoading ? (
                                    <div className="py-6 sm:py-8 text-center text-[#888888]">
                                        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 animate-spin text-[#ff7b00]" />
                                        <span className="text-sm sm:text-base">Getting explanation...</span>
                                    </div>
                                ) : aiExplanation && (
                                    <div className="space-y-3 sm:space-y-4">
                                        <div>
                                            <p className="text-[10px] sm:text-xs text-[#888888] mb-1">Definition</p>
                                            <p className="text-white text-sm sm:text-base">{aiExplanation.definition}</p>
                                        </div>
                                        {aiExplanation.pronunciation && (
                                            <p className="text-[#888888] text-xs sm:text-sm">{aiExplanation.pronunciation} • {aiExplanation.partOfSpeech}</p>
                                        )}
                                        {aiExplanation.examples.length > 0 && (
                                            <div>
                                                <p className="text-[10px] sm:text-xs text-[#888888] mb-1">Examples</p>
                                                <ul className="text-xs sm:text-sm text-white space-y-1">
                                                    {aiExplanation.examples.map((ex, i) => (
                                                        <li key={i} className="text-[#cccccc]">• {ex}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {aiExplanation.funFact && (
                                            <div className="bg-[#ff7b00]/10 p-2 sm:p-3 rounded-lg">
                                                <p className="text-[10px] sm:text-xs text-[#ff7b00] mb-1">💡 Fun Fact</p>
                                                <p className="text-xs sm:text-sm text-white">{aiExplanation.funFact}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Close button at bottom for mobile */}
                                <button
                                    onClick={() => setShowAIModal(false)}
                                    className="w-full mt-4 py-2.5 bg-[#2a2a2a] text-white rounded-lg font-medium text-sm hover:bg-[#3a3a3a] sm:hidden"
                                >
                                    Close
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Active Game Modal */}
                <AnimatePresence>
                    {showActiveGameModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                className="gamer-card p-8 max-w-md w-full text-center relative"
                            >
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#ff7b00]/20 flex items-center justify-center">
                                    <RotateCcw className="w-10 h-10 text-[#ff7b00]" />
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-2">Active Game Found</h2>
                                <p className="text-[#888888] mb-8">
                                    You have an unfinished game session. Would you like to continue playing or start a new game?
                                </p>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => setShowActiveGameModal(false)}
                                        className="gamer-btn-primary flex items-center justify-center gap-2 py-3"
                                    >
                                        <Play className="w-5 h-5" fill="white" />
                                        CONTINUE GAME
                                    </button>
                                    <button
                                        onClick={async () => {
                                            await completeGame(true);
                                            setShowActiveGameModal(false);
                                            resetGame();
                                        }}
                                        className="px-6 py-3 bg-[#2a2a2a] text-white rounded-lg font-bold hover:bg-[#ff3d3d]/20 hover:text-[#ff3d3d] transition-colors border border-transparent hover:border-[#ff3d3d]/50"
                                    >
                                        Forfeit & Start New
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Persistent How to Play Button */}
            <Link href="/how-to-play">
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 z-40 flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00] shadow-lg shadow-orange-500/30 border-2 border-white/20"
                    title="How to Play"
                >
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    <span className="text-white font-bold text-sm sm:text-base">How to Play</span>
                </motion.button>
            </Link>
        </div>
    );
}
