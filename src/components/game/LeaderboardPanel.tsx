'use client';

import React from 'react';
import { Trophy, Award, Link2, Star } from 'lucide-react';

interface LeaderboardPlayer {
    rank: number;
    name: string;
    score: number;
    avatar?: string;
}

interface Achievement {
    id: string;
    name: string;
    icon: React.ReactNode;
    unlocked: boolean;
}

interface LeaderboardPanelProps {
    players?: LeaderboardPlayer[];
    achievements?: Achievement[];
}

// Mock leaderboard data
const mockPlayers: LeaderboardPlayer[] = [
    { rank: 1, name: 'Nally', score: 1250 },
    { rank: 2, name: 'Nanme', score: 1050 },
    { rank: 3, name: 'Penty', score: 900 },
    { rank: 4, name: 'Jok', score: 500 },
    { rank: 5, name: 'Nanly', score: 400 },
];

// Mock achievements
const mockAchievements: Achievement[] = [
    { id: 'vocab', name: 'Vocabulary Victor', icon: <Trophy className="w-6 h-6 text-amber-600" />, unlocked: true },
    { id: 'chain', name: 'Chain Master', icon: <Link2 className="w-6 h-6 text-gray-600" />, unlocked: true },
    { id: 'streak', name: 'Streak Star', icon: <Star className="w-6 h-6 text-gray-400" />, unlocked: false },
    { id: 'perfect', name: 'Perfectionist', icon: <Award className="w-6 h-6 text-gray-400" />, unlocked: false },
];

export default function LeaderboardPanel({ players = mockPlayers, achievements = mockAchievements }: LeaderboardPanelProps) {
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
            <div className="game-panel-header">
                Leaderboard
            </div>

            <div className="p-3 flex-1">
                {/* Top Players */}
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-[var(--game-text-secondary)] mb-2">Top Players</h4>
                    <div className="space-y-1">
                        {players.slice(0, 5).map((player) => (
                            <div key={player.rank} className="leaderboard-item">
                                <span className={`leaderboard-rank ${getRankClass(player.rank)}`}>
                                    {player.rank}
                                </span>
                                <div className={`w-7 h-7 rounded-full ${getAvatarColor(player.rank)} flex items-center justify-center text-white text-xs font-bold`}>
                                    {player.name.charAt(0)}
                                </div>
                                <span className="flex-1 text-sm font-medium text-[var(--game-text-primary)]">
                                    {player.name}
                                </span>
                                <span className="text-sm font-bold text-[var(--game-text-primary)]">
                                    {player.score.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Achievements */}
                <div>
                    <h4 className="text-sm font-semibold text-[var(--game-text-secondary)] mb-3">Your Achievements</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {achievements.map((achievement) => (
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
