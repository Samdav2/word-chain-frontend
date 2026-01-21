'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Award, Link2, Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import leaderboardService, { LeaderboardEntry } from '@/services/leaderboardService';

interface Achievement {
    id: string;
    name: string;
    icon: React.ReactNode;
    unlocked: boolean;
}

// Mock achievements
const mockAchievements: Achievement[] = [
    { id: 'vocab', name: 'Vocabulary Victor', icon: <Trophy className="w-6 h-6 text-amber-600" />, unlocked: true },
    { id: 'chain', name: 'Chain Master', icon: <Link2 className="w-6 h-6 text-gray-600" />, unlocked: true },
    { id: 'streak', name: 'Streak Star', icon: <Star className="w-6 h-6 text-gray-400" />, unlocked: false },
    { id: 'perfect', name: 'Perfectionist', icon: <Award className="w-6 h-6 text-gray-400" />, unlocked: false },
];

export default function LeaderboardPanel() {
    const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTopPlayers();
    }, []);

    const loadTopPlayers = async () => {
        try {
            const data = await leaderboardService.getTopPlayers();
            setPlayers(data.entries.slice(0, 5));
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
            // Fallback mock data
            setPlayers([
                { rank: 1, user_id: '1', display_name: 'WordMaster', email: '', first_name: '', last_name: '', total_xp: 8500, games_won: 95, total_games: 100, win_rate: 0.95, average_moves: 3.2, tier: 'diamond', tier_badge: '👑' },
                { rank: 2, user_id: '2', display_name: 'ChainQueen', email: '', first_name: '', last_name: '', total_xp: 7200, games_won: 88, total_games: 95, win_rate: 0.93, average_moves: 3.5, tier: 'diamond', tier_badge: '👑' },
                { rank: 3, user_id: '3', display_name: 'VocabKing', email: '', first_name: '', last_name: '', total_xp: 5100, games_won: 75, total_games: 85, win_rate: 0.88, average_moves: 3.8, tier: 'platinum', tier_badge: '💎' },
                { rank: 4, user_id: '4', display_name: 'LinkLord', email: '', first_name: '', last_name: '', total_xp: 3200, games_won: 55, total_games: 70, win_rate: 0.79, average_moves: 4.1, tier: 'gold', tier_badge: '🥇' },
                { rank: 5, user_id: '5', display_name: 'WordWiz', email: '', first_name: '', last_name: '', total_xp: 2800, games_won: 45, total_games: 60, win_rate: 0.75, average_moves: 4.3, tier: 'gold', tier_badge: '🥇' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getRankClass = (rank: number) => {
        switch (rank) {
            case 1: return 'leaderboard-rank-1';
            case 2: return 'leaderboard-rank-2';
            case 3: return 'leaderboard-rank-3';
            default: return 'bg-gray-200 text-gray-700';
        }
    };

    const getAvatarColor = (rank: number) => {
        const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-orange-400'];
        return colors[(rank - 1) % colors.length];
    };

    return (
        <div className="game-panel h-full flex flex-col">
            <div className="game-panel-header flex items-center justify-between">
                <span>Leaderboard</span>
                <Link href="/leaderboard" className="text-xs text-[#ff7b00] hover:underline flex items-center gap-1">
                    View All <ChevronRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="p-3 flex-1">
                {/* Top Players */}
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-[var(--game-text-secondary)] mb-2">Top Players</h4>
                    {loading ? (
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="animate-pulse flex items-center gap-2 p-2">
                                    <div className="w-6 h-6 rounded bg-[#2a2a2a]" />
                                    <div className="w-7 h-7 rounded-full bg-[#2a2a2a]" />
                                    <div className="flex-1 h-4 bg-[#2a2a2a] rounded" />
                                    <div className="w-12 h-4 bg-[#2a2a2a] rounded" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {players.map((player) => (
                                <div key={player.rank} className="leaderboard-item">
                                    <span className={`leaderboard-rank ${getRankClass(player.rank)}`}>
                                        {player.rank}
                                    </span>
                                    <div className={`w-7 h-7 rounded-full ${getAvatarColor(player.rank)} flex items-center justify-center text-white text-xs font-bold`}>
                                        {player.display_name.charAt(0)}
                                    </div>
                                    <span className="flex-1 text-sm font-medium text-[var(--game-text-primary)] truncate">
                                        {player.display_name}
                                    </span>
                                    <span className="text-xs">{player.tier_badge}</span>
                                    <span className="text-sm font-bold text-[var(--game-text-primary)]">
                                        {player.total_xp.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Achievements */}
                <div>
                    <h4 className="text-sm font-semibold text-[var(--game-text-secondary)] mb-3">Your Achievements</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {mockAchievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className={`achievement-badge ${achievement.unlocked ? 'unlocked' : ''}`}
                            >
                                {achievement.icon}
                                <span className="text-[10px] text-center mt-1 text-[var(--game-text-secondary)] leading-tight">
                                    {achievement.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
