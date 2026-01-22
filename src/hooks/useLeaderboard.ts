'use client';

import { useQuery } from '@tanstack/react-query';
import leaderboardService, { LeaderboardEntry, UserRanking, TierInfo } from '@/services/leaderboardService';

// Query keys for caching
export const leaderboardKeys = {
    all: ['leaderboard'] as const,
    myRanking: () => [...leaderboardKeys.all, 'myRanking'] as const,
    topPlayers: () => [...leaderboardKeys.all, 'topPlayers'] as const,
    nearbyPlayers: () => [...leaderboardKeys.all, 'nearbyPlayers'] as const,
    tiers: () => [...leaderboardKeys.all, 'tiers'] as const,
    fullLeaderboard: (page: number) => [...leaderboardKeys.all, 'full', page] as const,
};

// Hook to get current user's ranking with live updates (30s refetch)
export function useMyRanking() {
    return useQuery({
        queryKey: leaderboardKeys.myRanking(),
        queryFn: async () => {
            try {
                return await leaderboardService.getMyRanking();
            } catch (error) {
                console.error('Failed to fetch user ranking:', error);
                return null;
            }
        },
        refetchInterval: 30000, // Refetch every 30 seconds for "live" feel
        staleTime: 15000, // Consider fresh for 15 seconds
    });
}

// Hook to get top players
export function useTopPlayers() {
    return useQuery({
        queryKey: leaderboardKeys.topPlayers(),
        queryFn: async () => {
            try {
                const data = await leaderboardService.getTopPlayers();
                return data;
            } catch (error) {
                console.error('Failed to fetch top players:', error);
                return { entries: [], total_players: 0, user_rank: 0 };
            }
        },
        refetchInterval: 30000, // Refetch every 30 seconds
        staleTime: 15000,
    });
}

// Hook to get players near current user
export function useNearbyPlayers(rangeSize: number = 5) {
    return useQuery({
        queryKey: [...leaderboardKeys.nearbyPlayers(), rangeSize],
        queryFn: async () => {
            try {
                const data = await leaderboardService.getNearbyPlayers(rangeSize);
                return data;
            } catch (error) {
                console.error('Failed to fetch nearby players:', error);
                return { entries: [], total_players: 0, user_rank: 0 };
            }
        },
        refetchInterval: 30000,
        staleTime: 15000,
    });
}

// Hook to get tier information (rarely changes, longer cache)
export function useTiers() {
    return useQuery({
        queryKey: leaderboardKeys.tiers(),
        queryFn: async () => {
            try {
                return await leaderboardService.getTiers();
            } catch (error) {
                console.error('Failed to fetch tiers:', error);
                // Return fallback tier data
                return [
                    { tier: 'bronze', name: 'Bronze', badge: '🥉', min_xp: 0, max_xp: 499 },
                    { tier: 'silver', name: 'Silver', badge: '🥈', min_xp: 500, max_xp: 1499 },
                    { tier: 'gold', name: 'Gold', badge: '🥇', min_xp: 1500, max_xp: 3499 },
                    { tier: 'platinum', name: 'Platinum', badge: '💎', min_xp: 3500, max_xp: 7499 },
                    { tier: 'diamond', name: 'Diamond', badge: '👑', min_xp: 7500, max_xp: null },
                ] as TierInfo[];
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes - tiers rarely change
        refetchInterval: false, // No auto-refetch for tiers
    });
}

// Hook for paginated full leaderboard
export function useLeaderboard(page: number, limit: number = 20) {
    return useQuery({
        queryKey: leaderboardKeys.fullLeaderboard(page),
        queryFn: async () => {
            try {
                const offset = (page - 1) * limit;
                return await leaderboardService.getLeaderboard(limit, offset);
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
                return { entries: [], total_players: 0, user_rank: 0 };
            }
        },
        refetchInterval: 30000,
        staleTime: 15000,
        placeholderData: (previousData) => previousData, // Keep previous data while loading
    });
}

// Combined hook for loading all leaderboard data at once
export function useLeaderboardData() {
    const myRanking = useMyRanking();
    const topPlayers = useTopPlayers();
    const nearbyPlayers = useNearbyPlayers();
    const tiers = useTiers();

    const isLoading = myRanking.isLoading || topPlayers.isLoading || nearbyPlayers.isLoading || tiers.isLoading;
    const isError = myRanking.isError && topPlayers.isError && nearbyPlayers.isError;

    return {
        myRanking: myRanking.data,
        topPlayers: topPlayers.data?.entries || [],
        nearbyPlayers: nearbyPlayers.data?.entries || [],
        tiers: tiers.data || [],
        totalPlayers: topPlayers.data?.total_players || 0,
        isLoading,
        isError,
        // Individual loading states for granular UI updates
        isRankingLoading: myRanking.isLoading,
        isTopLoading: topPlayers.isLoading,
        isNearbyLoading: nearbyPlayers.isLoading,
        isTiersLoading: tiers.isLoading,
    };
}
