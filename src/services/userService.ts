import api from './api';

// Types based on backend API
export interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    matric_no: string | null;
    role: string;
    current_xp: number;
    avatar_url: string | null;
    preferred_difficulty: string;
    created_at: string;
    games_played: number;
    games_won: number;
    total_moves: number;
    average_moves_per_game: number;
    win_rate: number;
}

// Dashboard Stats Types
export interface DashboardStats {
    level: number;
    current_xp: number;
    xp_to_next_level: number;
    total_xp: number;
    current_win_streak: number;
    best_win_streak: number;
    words_mastered: number;
    global_rank: number;
    rank_percentile: string;
}

// Daily Missions Types
export interface MissionReward {
    type: 'xp' | 'coins' | 'stars';
    amount: number;
}

export interface DailyMission {
    id: string;
    title: string;
    description: string;
    progress: number;
    max_progress: number;
    reward: MissionReward;
    completed: boolean;
}

export interface DailyMissionsResponse {
    missions: DailyMission[];
    completed_count: number;
    total_count: number;
    reset_time: string;
}

export interface PersonalStats {
    user_id: string;
    total_games: number;
    games_won: number;
    games_lost: number;
    win_rate: number;
    total_moves: number;
    average_moves_per_game: number;
    total_hints_used: number;
    total_xp: number;
    error_breakdown: {
        not_in_dictionary: number;
        not_one_letter: number;
        same_word: number;
        wrong_length: number;
        already_used: number;
    };
    sam_scores: {
        evaluation_score: number;
        design_score: number;
        develop_score: number;
    };
    time_metrics: {
        average_thinking_time_ms: number;
        total_session_time_seconds: number;
    };
    recent_games: any[];
}

export interface LeaderboardPlayer {
    rank: number;
    user_id: string;
    name: string;
    matric_no: string;
    total_xp: number;
    games_played: number;
    win_rate: number;
}

// User/Stats API Service
const userService = {
    /**
     * Get current user profile
     */
    getProfile: async (): Promise<UserProfile> => {
        const response = await api.get('/users/me');
        return response.data;
    },

    /**
     * Update user profile
     */
    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        const response = await api.put('/users/me', data);
        return response.data;
    },

    /**
     * Change password
     */
    changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        await api.put('/users/me/password', {
            current_password: currentPassword,
            new_password: newPassword,
        });
    },

    /**
     * Get comprehensive personal stats with SAM analytics
     */
    getPersonalStats: async (): Promise<PersonalStats> => {
        const response = await api.get('/stats/personal');
        return response.data;
    },

    /**
     * Get leaderboard
     */
    getLeaderboard: async (limit: number = 10): Promise<LeaderboardPlayer[]> => {
        const response = await api.get('/stats/leaderboard', {
            params: { limit },
        });

        // Handle response structure
        const data = response.data;
        const entries = Array.isArray(data) ? data : (data.entries || data.leaderboard || data.players || []);

        // Map to LeaderboardPlayer interface
        return entries.map((entry: any) => ({
            rank: entry.rank,
            user_id: entry.user_id,
            name: entry.name || entry.email?.split('@')[0] || entry.matric_no || 'Unknown',
            matric_no: entry.matric_no,
            total_xp: entry.total_xp,
            games_played: entry.games_played || (entry.games_won && entry.win_rate ? Math.round(entry.games_won / entry.win_rate) : 0),
            win_rate: entry.win_rate
        }));
    },

    /**
     * Get dashboard stats (level, XP, win streak, global rank)
     */
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    },

    /**
     * Get daily missions with progress
     */
    getDailyMissions: async (): Promise<DailyMissionsResponse> => {
        const response = await api.get('/missions/daily');
        return response.data;
    },
};

export default userService;
