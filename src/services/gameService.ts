import api from './api';

// Types based on backend API v2.0
export type GameCategory = 'general' | 'science' | 'biology' | 'physics' | 'education' | 'mixed';
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface StartGameRequest {
    mode?: 'standard' | 'edtech_only';
    category?: GameCategory;
    difficulty?: DifficultyLevel;
}

export interface StartGameResponse {
    session_id: string;
    start_word: string;
    target_word: string;
    mode: string;
    category: GameCategory;
    difficulty_level: DifficultyLevel;
    message: string;
}

export interface ValidateWordRequest {
    session_id: string;
    current_word: string;
    next_word: string;
    thinking_time_ms?: number;
}

export interface ValidateWordResponse {
    valid: boolean;
    score_delta: number;
    reason: string | null;
    distance_remaining: number;
    current_word: string;
    target_word: string;
    total_score: number;
    moves_count: number;
    is_complete: boolean;
    word_definition: string | null;
    learning_tip: string | null;
    word_difficulty: number;
    message: string;
}

export interface HintRequest {
    session_id: string;
}

export interface HintResponse {
    hint_word: string;
    hint_cost: number;
    hints_used: number;
    hints_remaining: number;
    max_hints_allowed: number;
    learning_tip: string | null;
    message: string;
}

export interface CompleteGameRequest {
    session_id: string;
    forfeit?: boolean;
}

export interface CompleteGameResponse {
    session_id: string;
    is_won: boolean;
    total_score: number;
    moves_count: number;
    hints_used: number;
    xp_earned: number;
    path_taken: string[];
    optimal_path_length: number;
    message: string;
}

export interface GameHistoryItem {
    id: string;
    mode: string;
    category: GameCategory;
    difficulty_level: DifficultyLevel;
    start_time: string;
    end_time: string;
    target_word_start: string;
    target_word_end: string;
    moves_count: number;
    hints_used: number;
    is_completed: boolean;
    is_won: boolean;
    total_score: number;
    xp_earned: number;
}

export interface CategoryInfo {
    name: GameCategory;
    description: string;
    word_count: number;
    sample_words: string[];
}

export interface CategoriesResponse {
    categories: CategoryInfo[];
    total_words: number;
}

export interface WordInfo {
    word: string;
    category: GameCategory;
    difficulty: number;
    definition: string | null;
    pronunciation: string | null;
    part_of_speech: string | null;
    examples: string[];
    etymology: string | null;
    learning_tip: string | null;
    neighbors: string[];
}

// Game API Service v2.0
const gameService = {
    /**
     * Start a new game session with category and difficulty
     */
    startGame: async (
        mode: 'standard' | 'edtech_only' = 'standard',
        category: GameCategory = 'general',
        difficulty: DifficultyLevel = 3
    ): Promise<StartGameResponse> => {
        console.log('Starting game with payload:', { mode, category, difficulty });
        try {
            const response = await api.post('/game/start', { mode, category, difficulty });
            return response.data;
        } catch (error: any) {
            console.error('Start game error:', error.response?.data || error.message);
            throw error;
        }
    },

    /**
     * Validate a word move
     */
    validateWord: async (
        sessionId: string,
        currentWord: string,
        nextWord: string,
        thinkingTimeMs?: number
    ): Promise<ValidateWordResponse> => {
        const response = await api.post('/game/validate', {
            session_id: sessionId,
            current_word: currentWord,
            next_word: nextWord,
            thinking_time_ms: thinkingTimeMs || 0,
        });
        return response.data;
    },

    /**
     * Get a hint for the next optimal word
     */
    getHint: async (sessionId: string): Promise<HintResponse> => {
        const response = await api.post('/game/hint', {
            session_id: sessionId,
        });
        return response.data;
    },

    /**
     * Complete or forfeit the game
     */
    completeGame: async (sessionId: string, forfeit: boolean = false): Promise<CompleteGameResponse> => {
        const response = await api.post('/game/complete', {
            session_id: sessionId,
            forfeit,
        });
        return response.data;
    },

    /**
     * Get game history
     */
    getHistory: async (skip: number = 0, limit: number = 20): Promise<GameHistoryItem[]> => {
        const response = await api.get('/game/history', {
            params: { skip, limit },
        });
        return response.data;
    },

    /**
     * Get all available categories
     */
    getCategories: async (): Promise<CategoriesResponse> => {
        const response = await api.get('/game/categories');
        return response.data;
    },

    /**
     * Get word information
     */
    getWordInfo: async (word: string): Promise<WordInfo> => {
        const response = await api.get(`/game/word/${word}`);
        return response.data;
    },

    /**
     * Get active game session
     */
    getActiveGame: async (): Promise<GameHistoryItem | null> => {
        const response = await api.get('/game/active');
        return response.data;
    },
};

export default gameService;
