'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart2, Target, Trophy, Flame, AlertCircle,
    CheckCircle, Clock, TrendingUp, Brain, Zap,
    ArrowLeft, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import userService, { PersonalStats } from '@/services/userService';
import gameService, { GameHistoryItem } from '@/services/gameService';

export default function AnalyticsPage() {
    const [stats, setStats] = useState<PersonalStats | null>(null);
    const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [statsData, historyData] = await Promise.all([
                userService.getPersonalStats(),
                gameService.getHistory(0, 10)
            ]);
            setStats(statsData);
            setGameHistory(historyData);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
            // Use mock data for demo
            setStats({
                user_id: 'demo',
                total_games: 25,
                games_won: 18,
                games_lost: 7,
                win_rate: 72.0,
                total_moves: 150,
                average_moves_per_game: 6.0,
                total_hints_used: 5,
                total_xp: 2450,
                error_breakdown: {
                    not_in_dictionary: 12,
                    not_one_letter: 5,
                    same_word: 0,
                    wrong_length: 2,
                    already_used: 3
                },
                sam_scores: {
                    evaluation_score: 75.5,
                    design_score: 82.3,
                    develop_score: 68.0
                },
                time_metrics: {
                    average_thinking_time_ms: 2500,
                    total_session_time_seconds: 3600
                },
                recent_games: []
            });
            setGameHistory([
                { id: '1', mode: 'standard', category: 'science', difficulty_level: 3, start_time: '2026-01-20T10:00:00Z', end_time: '2026-01-20T10:05:00Z', target_word_start: 'FAIL', target_word_end: 'PASS', moves_count: 4, hints_used: 0, is_completed: true, is_won: true, total_score: 90, xp_earned: 120 },
                { id: '2', mode: 'standard', category: 'biology', difficulty_level: 2, start_time: '2026-01-19T15:00:00Z', end_time: '2026-01-19T15:08:00Z', target_word_start: 'CAT', target_word_end: 'DOG', moves_count: 6, hints_used: 1, is_completed: true, is_won: true, total_score: 75, xp_earned: 85 },
                { id: '3', mode: 'standard', category: 'general', difficulty_level: 4, start_time: '2026-01-18T12:00:00Z', end_time: '2026-01-18T12:03:00Z', target_word_start: 'COLD', target_word_end: 'WARM', moves_count: 3, hints_used: 0, is_completed: true, is_won: false, total_score: 30, xp_earned: 30 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getErrorLabel = (key: string) => {
        const labels: Record<string, string> = {
            not_in_dictionary: 'Invalid Word',
            not_one_letter: 'Multiple Letters Changed',
            same_word: 'Same Word',
            wrong_length: 'Wrong Length',
            already_used: 'Already Used'
        };
        return labels[key] || key;
    };

    if (loading) {
        return (
            <div className="gamistic-theme gamistic-container min-h-screen flex items-center justify-center">
                <div className="text-white text-xl flex items-center gap-3">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    Loading Analytics...
                </div>
            </div>
        );
    }

    return (
        <div className="gamistic-theme gamistic-container min-h-screen p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors">
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                                <BarChart2 className="w-8 h-8 text-[#ff7b00]" />
                                Learning Analytics
                            </h1>
                            <p className="text-[#888888] text-sm">Track your word chain mastery</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchData}
                        className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors"
                    >
                        <RefreshCw className="w-5 h-5 text-[#888888]" />
                    </button>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="gamer-card gamer-stat-orange"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-5 h-5 text-[#ff7b00]" />
                            <span className="text-sm text-[#888888]">Total XP</span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black glow-text-orange">{stats?.total_xp?.toLocaleString()}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="gamer-card gamer-stat-red"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Trophy className="w-5 h-5 text-[#ff3d3d]" />
                            <span className="text-sm text-[#888888]">Win Rate</span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-white">{stats?.win_rate?.toFixed(1)}%</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="gamer-card"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Target className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-[#888888]">Games Played</span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-white">{stats?.total_games}</p>
                        <p className="text-xs text-green-500">{stats?.games_won} won</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="gamer-card"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-5 h-5 text-blue-400" />
                            <span className="text-sm text-[#888888]">Avg. Think Time</span>
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-white">
                            {((stats?.time_metrics?.average_thinking_time_ms || 0) / 1000).toFixed(1)}s
                        </p>
                    </motion.div>
                </div>

                {/* SAM Scores & Error Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* SAM Scores */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="gamer-card"
                    >
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-[#ff7b00]" />
                            SAM Learning Scores
                        </h2>
                        <p className="text-xs text-[#888888] mb-4">Successive Approximation Model metrics</p>

                        <div className="space-y-4">
                            {[
                                { label: 'Evaluation', score: stats?.sam_scores?.evaluation_score || 0, color: '#ff3d3d' },
                                { label: 'Design', score: stats?.sam_scores?.design_score || 0, color: '#ff7b00' },
                                { label: 'Development', score: stats?.sam_scores?.develop_score || 0, color: '#22c55e' },
                            ].map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-white font-medium">{item.label}</span>
                                        <span className="text-white font-bold">{item.score.toFixed(1)}%</span>
                                    </div>
                                    <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.score}%` }}
                                            transition={{ duration: 1, delay: index * 0.2 }}
                                            className="h-full rounded-full"
                                            style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color}aa)` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Error Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="gamer-card"
                    >
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-[#ff3d3d]" />
                            Error Analysis
                        </h2>
                        <p className="text-xs text-[#888888] mb-4">Common mistakes to improve</p>

                        <div className="space-y-3">
                            {stats?.error_breakdown && Object.entries(stats.error_breakdown)
                                .sort(([, a], [, b]) => b - a)
                                .map(([key, count], index) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <span className="text-sm text-[#888888]">{getErrorLabel(key)}</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min((count / 20) * 100, 100)}%` }}
                                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                                    className="h-full bg-[#ff3d3d] rounded-full"
                                                />
                                            </div>
                                            <span className="text-white font-bold w-8 text-right">{count}</span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </motion.div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="gamer-card text-center">
                        <p className="text-xs text-[#888888] mb-1">Total Moves</p>
                        <p className="text-2xl font-bold text-white">{stats?.total_moves}</p>
                    </div>
                    <div className="gamer-card text-center">
                        <p className="text-xs text-[#888888] mb-1">Avg Moves/Game</p>
                        <p className="text-2xl font-bold text-white">{stats?.average_moves_per_game?.toFixed(1)}</p>
                    </div>
                    <div className="gamer-card text-center">
                        <p className="text-xs text-[#888888] mb-1">Hints Used</p>
                        <p className="text-2xl font-bold text-[#ff7b00]">{stats?.total_hints_used}</p>
                    </div>
                    <div className="gamer-card text-center">
                        <p className="text-xs text-[#888888] mb-1">Games Lost</p>
                        <p className="text-2xl font-bold text-[#ff3d3d]">{stats?.games_lost}</p>
                    </div>
                </div>

                {/* Game History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="gamer-card p-0 overflow-hidden"
                >
                    <div className="p-4 border-b border-[#2a2a2a]">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#ff7b00]" />
                            Recent Games
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[#0a0a0a] text-[#888888] uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 text-left">Date</th>
                                    <th className="px-4 py-3 text-left">Challenge</th>
                                    <th className="px-4 py-3 text-center">Moves</th>
                                    <th className="px-4 py-3 text-center">Hints</th>
                                    <th className="px-4 py-3 text-center">Score</th>
                                    <th className="px-4 py-3 text-center">Result</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1a1a1a]">
                                {gameHistory.map((game, index) => (
                                    <tr key={game.id} className="hover:bg-[#1a1a1a] transition-colors">
                                        <td className="px-4 py-3 text-[#888888] text-xs sm:text-sm whitespace-nowrap">
                                            {formatDate(game.start_time)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[#ff3d3d] font-bold">{game.target_word_start}</span>
                                            <span className="text-[#666666] mx-2">→</span>
                                            <span className="text-green-500 font-bold">{game.target_word_end}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-white">{game.moves_count}</td>
                                        <td className="px-4 py-3 text-center text-[#ff7b00]">{game.hints_used}</td>
                                        <td className="px-4 py-3 text-center font-bold glow-text-orange">{game.total_score}</td>
                                        <td className="px-4 py-3 text-center">
                                            {game.is_won ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Won
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#ff3d3d]/10 text-[#ff3d3d] text-xs font-medium">
                                                    <AlertCircle className="w-3 h-3" />
                                                    Lost
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {gameHistory.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-[#888888]">
                                            No games played yet. Start playing to see your history!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
