import api from './api';

// Types
export interface LeaderboardEntry {
    rank: number;
    user_id: string;
    display_name: string;
    email: string;
    first_name: string;
    last_name: string;
    total_xp: number;
    games_won: number;
    total_games: number;
    win_rate: number;
    average_moves: number;
    tier: string;
    tier_badge: string;
}

export interface LeaderboardResponse {
    entries: LeaderboardEntry[];
    total_players: number;
    user_rank: number;
}

export interface UserRanking {
    rank: number;
    total_players: number;
    display_name: string;
    total_xp: number;
    tier: string;
    tier_badge: string;
    games_won: number;
    total_games: number;
    win_rate: number;
    xp_to_next_tier: number;
    next_tier: string;
    percentile: number;
}

export interface TierInfo {
    tier: string;
    name: string;
    badge: string;
    min_xp: number;
    max_xp: number | null;
}

// Leaderboard Service
const leaderboardService = {
    /**
     * Get full leaderboard with pagination
     */
    async getLeaderboard(limit: number = 50, offset: number = 0): Promise<LeaderboardResponse> {
        const response = await api.get('/leaderboard', {
            params: { limit, offset }
        });
        return response.data;
    },

    /**
     * Get top 10 players for dashboard widget
     */
    async getTopPlayers(): Promise<LeaderboardResponse> {
        const response = await api.get('/leaderboard/top');
        return response.data;
    },

    /**
     * Get current user's detailed ranking
     */
    async getMyRanking(): Promise<UserRanking> {
        const response = await api.get('/leaderboard/me');
        return response.data;
    },

    /**
     * Get players near user's rank (±range_size)
     */
    async getNearbyPlayers(rangeSize: number = 5): Promise<LeaderboardResponse> {
        const response = await api.get('/leaderboard/nearby', {
            params: { range_size: rangeSize }
        });
        return response.data;
    },

    /**
     * Get all tier information
     */
    async getTiers(): Promise<TierInfo[]> {
        const response = await api.get('/leaderboard/tiers');
        return response.data;
    }
};

export default leaderboardService;
