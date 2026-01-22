'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import {
    Play, Trophy, Target, Flame, Swords, Crown,
    ChevronRight, Zap, Award, TrendingUp, RefreshCw
} from 'lucide-react';

// Gaming Components
import GamingStatsCard from '@/components/dashboard/GamingStatsCard';
import XPProgressBar from '@/components/dashboard/XPProgressBar';
import MissionCard from '@/components/dashboard/MissionCard';

// Services
import userService, { DashboardStats, DailyMission, LeaderboardPlayer } from '@/services/userService';
import gameService, { GameHistoryItem } from '@/services/gameService';

export default function DashboardPage() {
    const { user } = useAuth();

    // State for real data
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [missions, setMissions] = useState<DailyMission[]>([]);
    const [missionsCompleted, setMissionsCompleted] = useState(0);
    const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);
    const [recentGames, setRecentGames] = useState<GameHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsData, missionsData, leaderboardData, historyData] = await Promise.all([
                userService.getDashboardStats(),
                userService.getDailyMissions(),
                userService.getLeaderboard(4),
                gameService.getHistory(0, 3)
            ]);

            setDashboardStats(statsData);
            setMissions(missionsData.missions);
            setMissionsCompleted(missionsData.completed_count);
            setLeaderboard(leaderboardData);
            setRecentGames(historyData);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            // Use fallback mock data if API fails
            setDashboardStats({
                level: 12,
                current_xp: 2750,
                xp_to_next_level: 4000,
                total_xp: 12450,
                current_win_streak: 7,
                best_win_streak: 12,
                words_mastered: 156,
                global_rank: 15,
                rank_percentile: 'Top 5%'
            });
            setMissions([
                { id: 'word_warrior', title: 'Word Warrior', description: 'Win 3 word chain games', progress: 2, max_progress: 3, reward: { type: 'xp', amount: 150 }, completed: false },
                { id: 'speed_demon', title: 'Speed Demon', description: 'Complete a game in under 60 seconds', progress: 0, max_progress: 1, reward: { type: 'coins', amount: 50 }, completed: false },
                { id: 'vocab_master', title: 'Vocabulary Master', description: 'Use 10 unique words', progress: 7, max_progress: 10, reward: { type: 'stars', amount: 3 }, completed: false },
            ]);
            setLeaderboard([
                { user_id: '1', name: 'WordMaster99', rank: 1, total_xp: 15420, matric_no: 'U2023001', games_played: 150, win_rate: 0.85 },
                { user_id: '2', name: 'LexiconKing', rank: 2, total_xp: 14200, matric_no: 'U2023002', games_played: 140, win_rate: 0.82 },
                { user_id: '3', name: 'VocabVixen', rank: 3, total_xp: 13850, matric_no: 'U2023003', games_played: 135, win_rate: 0.80 },
                { user_id: '4', name: 'SyntaxSage', rank: 4, total_xp: 12100, matric_no: 'U2023004', games_played: 120, win_rate: 0.78 },
            ]);
            setMissionsCompleted(2);
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    if (loading) {
        return (
            <div className="gamistic-theme gamistic-container min-h-screen flex items-center justify-center">
                <div className="text-white text-xl flex items-center gap-3">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    Loading Dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="gamistic-theme gamistic-container min-h-screen p-3 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="gamer-card relative overflow-visible p-4 sm:p-6"
                >
                    <div className="flex flex-col gap-4 sm:gap-6">
                        {/* Top Row: Avatar + Info + Button */}
                        <div className="flex items-center justify-between gap-3 sm:gap-5">
                            {/* Player Info */}
                            <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
                                <div className="avatar-ring flex-shrink-0">
                                    <div className="w-12 h-12 sm:w-16 md:w-20 sm:h-16 md:h-20 rounded-full bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00] flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-black text-white">
                                        {(user?.first_name || user?.display_name || 'P').charAt(0)}
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black text-white leading-tight">
                                        <span className="hidden sm:inline">Welcome back, </span>
                                        <span className="text-white sm:glow-text-orange truncate block sm:inline">
                                            {user?.first_name || user?.display_name || 'Player'}
                                        </span>
                                        <span className="hidden sm:inline">!</span>
                                    </h1>
                                    <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2 flex-wrap">
                                        <span className="level-badge text-[10px] sm:text-xs py-1 px-2 sm:py-1.5 sm:px-3">
                                            <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                            Lvl {dashboardStats?.level || 1}
                                        </span>
                                        <span className="text-[#888888] text-[10px] sm:text-sm hidden sm:inline">Word Chain Champion</span>
                                    </div>
                                </div>
                            </div>

                            {/* Play Now Button */}
                            <Link href="/game" className="flex-shrink-0">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00] text-white font-bold rounded-lg shadow-lg flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm py-2 px-3 sm:py-3 sm:px-5"
                                >
                                    <Play className="w-4 h-4 sm:w-5 sm:h-5" fill="white" />
                                    <span className="hidden sm:inline">PLAY NOW</span>
                                    <span className="sm:hidden">PLAY</span>
                                </motion.button>
                            </Link>
                        </div>

                        {/* XP Progress */}
                        <div>
                            <XPProgressBar
                                currentXP={dashboardStats?.current_xp || 0}
                                maxXP={dashboardStats?.xp_to_next_level || 1000}
                                level={dashboardStats?.level || 1}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <GamingStatsCard
                        title="Total XP"
                        value={(dashboardStats?.total_xp || 0).toLocaleString()}
                        icon={<Zap className="w-6 h-6" />}
                        trend="+340 today"
                        trendUp={true}
                        variant="orange"
                    />
                    <GamingStatsCard
                        title="Win Streak"
                        value={`${dashboardStats?.current_win_streak || 0} 🔥`}
                        icon={<Flame className="w-6 h-6" />}
                        trend={dashboardStats?.current_win_streak === dashboardStats?.best_win_streak ? 'Personal best!' : `Best: ${dashboardStats?.best_win_streak || 0}`}
                        trendUp={true}
                        variant="red"
                    />
                    <GamingStatsCard
                        title="Words Mastered"
                        value={(dashboardStats?.words_mastered || 0).toString()}
                        icon={<Trophy className="w-6 h-6" />}
                        trend="+12 this week"
                        trendUp={true}
                        variant="white"
                    />
                    <GamingStatsCard
                        title="Global Rank"
                        value={`#${dashboardStats?.global_rank || '-'}`}
                        icon={<TrendingUp className="w-6 h-6" />}
                        trend={dashboardStats?.rank_percentile || ''}
                        trendUp={true}
                        variant="orange"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Daily Missions */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Target className="w-5 h-5 text-[#ff7b00]" />
                                Daily Missions
                            </h2>
                            <span className="text-sm text-[#888888]">{missionsCompleted}/{missions.length} Completed</span>
                        </div>

                        <div className="space-y-3">
                            {missions.map((mission) => (
                                <MissionCard
                                    key={mission.id}
                                    title={mission.title}
                                    description={mission.description}
                                    progress={mission.progress}
                                    maxProgress={mission.max_progress}
                                    reward={mission.reward}
                                    completed={mission.completed}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Crown className="w-5 h-5 text-yellow-400" />
                                Leaderboard
                            </h2>
                            <Link href="/leaderboard" className="text-sm text-[#ff7b00] hover:underline flex items-center gap-1">
                                View All <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="gamer-card space-y-2 p-0 overflow-hidden min-h-[100px]">
                            {Array.isArray(leaderboard) && leaderboard.length > 0 ? (
                                leaderboard.map((player, index) => {
                                    const isCurrentUser = player.user_id === user?.id;
                                    return (
                                        <div
                                            key={player.user_id}
                                            className={`flex items-center gap-3 p-4 transition-colors ${isCurrentUser
                                                ? 'bg-gradient-to-r from-[#ff3d3d]/10 to-[#ff7b00]/10 border-l-2 border-[#ff7b00]'
                                                : 'hover:bg-[#1a1a1a]'
                                                }`}
                                        >
                                            {/* Rank */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${player.rank === 1 ? 'rank-gold' :
                                                player.rank === 2 ? 'rank-silver' :
                                                    player.rank === 3 ? 'rank-bronze' :
                                                        'bg-[#2a2a2a] text-white'
                                                }`}>
                                                {player.rank <= 3 ? (
                                                    player.rank === 1 ? '👑' : player.rank === 2 ? '🥈' : '🥉'
                                                ) : `#${player.rank}`}
                                            </div>

                                            {/* Player */}
                                            <div className="flex-1">
                                                <span className={`font-medium ${isCurrentUser ? 'text-[#ff7b00]' : 'text-white'}`}>
                                                    {player.name}
                                                </span>
                                            </div>

                                            {/* Score */}
                                            <span className="font-bold text-white">
                                                {player.total_xp.toLocaleString()}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center text-[#888888]">
                                    <p>No players found yet.</p>
                                    <p className="text-xs mt-1">Be the first to climb the ranks!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Battles */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Swords className="w-5 h-5 text-[#ff3d3d]" />
                            Recent Battles
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recentGames.map((game) => (
                            <motion.div
                                key={game.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.02 }}
                                className={`battle-card ${game.is_won ? 'battle-win' : 'battle-loss'}`}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${game.is_won
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {game.is_won ? 'WIN' : 'LOSS'}
                                        </span>
                                        <span className="text-xs text-[#666666]">{formatTimeAgo(game.start_time)}</span>
                                    </div>
                                    <h4 className="font-bold text-white">
                                        {game.target_word_start} → {game.target_word_end}
                                    </h4>
                                    <p className="text-sm text-[#888888]">Score: {game.total_score}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-[#ff7b00]">
                                        <Zap className="w-4 h-4" />
                                        <span className="font-bold">+{game.xp_earned || 0}</span>
                                    </div>
                                    <span className="text-xs text-[#666666]">XP</span>
                                </div>
                            </motion.div>
                        ))}
                        {recentGames.length === 0 && (
                            <div className="col-span-3 text-center py-8 text-[#888888]">
                                No games played yet. Start playing to see your history!
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: <Trophy className="w-6 h-6" />, label: 'Achievements', color: 'orange', href: '/achievements' },
                        { icon: <Award className="w-6 h-6" />, label: 'Rewards', color: 'red', href: '/achievements?tab=daily' },
                        { icon: <Target className="w-6 h-6" />, label: 'Practice', color: 'white', href: '/game' },
                        { icon: <TrendingUp className="w-6 h-6" />, label: 'Analytics', color: 'orange', href: '/analytics' },
                    ].map((action, index) => (
                        <Link key={index} href={action.href}>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="gamer-card flex flex-col items-center gap-3 py-6 cursor-pointer w-full"
                            >
                                <div className={`p-3 rounded-lg bg-[#0a0a0a] ${action.color === 'red' ? 'text-[#ff3d3d]' :
                                    action.color === 'orange' ? 'text-[#ff7b00]' :
                                        'text-white'
                                    }`}>
                                    {action.icon}
                                </div>
                                <span className="font-medium text-white">{action.label}</span>
                            </motion.button>
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}
