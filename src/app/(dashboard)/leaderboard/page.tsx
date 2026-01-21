'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Crown, Medal, ChevronUp, ChevronDown,
    Target, Flame, Star, Users, TrendingUp,
    ChevronLeft, ChevronRight, Search, Zap
} from 'lucide-react';
import leaderboardService, { LeaderboardEntry, UserRanking, TierInfo } from '@/services/leaderboardService';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

// Tier color mapping
const TIER_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    bronze: { bg: 'bg-amber-900/20', border: 'border-amber-700', text: 'text-amber-500', glow: 'shadow-amber-500/20' },
    silver: { bg: 'bg-gray-400/20', border: 'border-gray-400', text: 'text-gray-300', glow: 'shadow-gray-400/20' },
    gold: { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', glow: 'shadow-yellow-500/30' },
    platinum: { bg: 'bg-cyan-500/20', border: 'border-cyan-400', text: 'text-cyan-400', glow: 'shadow-cyan-500/30' },
    diamond: { bg: 'bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-400', glow: 'shadow-purple-500/30' },
};

// User Rank Hero Card
const UserRankHero = ({ ranking }: { ranking: UserRanking | null }) => {
    if (!ranking) return null;
    const tierStyle = TIER_COLORS[ranking.tier] || TIER_COLORS.bronze;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`gamer-card p-6 relative overflow-hidden border ${tierStyle.border}`}
        >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00]" />
            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl ${tierStyle.bg}`} />

            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                {/* Rank Badge */}
                <div className="relative">
                    <div className={`w-24 h-24 rounded-2xl ${tierStyle.bg} border-2 ${tierStyle.border} flex items-center justify-center shadow-lg ${tierStyle.glow}`}>
                        <span className="text-4xl">{ranking.tier_badge}</span>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#2a2a2a]">
                        <span className="text-lg font-black text-white">#{ranking.rank}</span>
                    </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-black text-white">{ranking.display_name}</h2>
                    <p className={`font-bold ${tierStyle.text} capitalize`}>{ranking.tier} Tier</p>

                    {/* XP Progress to Next Tier */}
                    {ranking.next_tier && (
                        <div className="mt-3">
                            <div className="flex justify-between text-xs text-[#888888] mb-1">
                                <span>{ranking.total_xp.toLocaleString()} XP</span>
                                <span>{ranking.xp_to_next_tier.toLocaleString()} XP to {ranking.next_tier}</span>
                            </div>
                            <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (ranking.total_xp / ranking.xp_to_next_tier) * 100)}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00] rounded-full"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 md:gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-black text-white">{ranking.games_won}</div>
                        <div className="text-xs text-[#888888]">Wins</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-[#ff7b00]">{Math.round(ranking.win_rate * 100)}%</div>
                        <div className="text-xs text-[#888888]">Win Rate</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-white">Top {Math.round(100 - ranking.percentile)}%</div>
                        <div className="text-xs text-[#888888]">Percentile</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Top 3 Podium
const TopThreePodium = ({ entries }: { entries: LeaderboardEntry[] }) => {
    const top3 = entries.slice(0, 3);
    const podiumOrder = [1, 0, 2]; // Second, First, Third for visual layout

    return (
        <div className="flex items-end justify-center gap-2 md:gap-4 py-8">
            {podiumOrder.map((index) => {
                const player = top3[index];
                if (!player) return <div key={index} className="flex-1 max-w-[140px]" />;

                const heights = ['h-32', 'h-40', 'h-24'];
                const colors = ['bg-gradient-to-t from-gray-500 to-gray-400', 'bg-gradient-to-t from-yellow-600 to-yellow-400', 'bg-gradient-to-t from-amber-800 to-amber-600'];
                const badges = ['🥈', '🥇', '🥉'];
                const scales = ['scale-100', 'scale-110', 'scale-100'];

                return (
                    <motion.div
                        key={player.rank}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex-1 max-w-[140px] ${scales[index]}`}
                    >
                        {/* Player Avatar */}
                        <div className="text-center mb-2">
                            <div className="relative inline-block">
                                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-2 border-[#3a3a3a] flex items-center justify-center text-2xl font-bold text-white mx-auto`}>
                                    {player.display_name.charAt(0)}
                                </div>
                                <span className="absolute -top-2 -right-2 text-2xl">{badges[index]}</span>
                            </div>
                            <p className="text-sm font-bold text-white mt-2 truncate">{player.display_name}</p>
                            <p className="text-xs text-[#ff7b00]">{player.total_xp.toLocaleString()} XP</p>
                        </div>

                        {/* Podium */}
                        <div className={`${heights[index]} ${colors[index]} rounded-t-lg flex items-center justify-center relative overflow-hidden`}>
                            <span className="text-white text-3xl font-black opacity-30">{player.rank}</span>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

// Nearby Players
const NearbyPlayers = ({ entries, userRank }: { entries: LeaderboardEntry[]; userRank: number }) => {
    return (
        <div className="gamer-card p-4">
            <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-[#ff7b00]" />
                <h3 className="text-lg font-bold text-white">Players Near You</h3>
            </div>
            <div className="space-y-2">
                {entries.map((player) => {
                    const isCurrentUser = player.rank === userRank;
                    const tierStyle = TIER_COLORS[player.tier] || TIER_COLORS.bronze;

                    return (
                        <motion.div
                            key={player.rank}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isCurrentUser
                                ? 'bg-[#ff7b00]/10 border border-[#ff7b00]/30'
                                : 'bg-[#1a1a1a] hover:bg-[#2a2a2a]'
                                }`}
                        >
                            <span className={`w-8 text-center font-bold ${isCurrentUser ? 'text-[#ff7b00]' : 'text-[#888888]'}`}>
                                #{player.rank}
                            </span>
                            <div className={`w-10 h-10 rounded-lg ${tierStyle.bg} flex items-center justify-center`}>
                                <span className="text-lg">{player.tier_badge}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`font-bold truncate ${isCurrentUser ? 'text-[#ff7b00]' : 'text-white'}`}>
                                    {player.display_name} {isCurrentUser && '(You)'}
                                </p>
                                <p className="text-xs text-[#888888]">{player.total_xp.toLocaleString()} XP</p>
                            </div>
                            {player.rank < userRank ? (
                                <ChevronUp className="w-5 h-5 text-green-500" />
                            ) : player.rank > userRank ? (
                                <ChevronDown className="w-5 h-5 text-red-500" />
                            ) : null}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// Tier Progression
const TierProgression = ({ tiers, currentTier }: { tiers: TierInfo[]; currentTier: string }) => {
    return (
        <div className="gamer-card p-4">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#ff7b00]" />
                <h3 className="text-lg font-bold text-white">Tier System</h3>
            </div>
            <div className="space-y-3">
                {tiers.map((tier, index) => {
                    const isCurrentTier = tier.tier === currentTier;
                    const isPastTier = tiers.findIndex(t => t.tier === currentTier) > index;
                    const tierStyle = TIER_COLORS[tier.tier] || TIER_COLORS.bronze;

                    return (
                        <motion.div
                            key={tier.tier}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${isCurrentTier
                                ? `${tierStyle.bg} ${tierStyle.border} shadow-lg ${tierStyle.glow}`
                                : isPastTier
                                    ? 'bg-[#1a1a1a] border-green-500/30'
                                    : 'bg-[#1a1a1a] border-[#2a2a2a]'
                                }`}
                        >
                            <span className="text-2xl">{tier.badge}</span>
                            <div className="flex-1">
                                <p className={`font-bold ${isCurrentTier ? tierStyle.text : 'text-white'}`}>{tier.name}</p>
                                <p className="text-xs text-[#888888]">
                                    {tier.min_xp.toLocaleString()} {tier.max_xp ? `- ${tier.max_xp.toLocaleString()}` : '+'} XP
                                </p>
                            </div>
                            {isPastTier && (
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Star className="w-4 h-4 text-green-500" fill="currentColor" />
                                </div>
                            )}
                            {isCurrentTier && (
                                <div className="px-2 py-1 rounded-full bg-[#ff7b00]/20 text-[#ff7b00] text-xs font-bold">
                                    Current
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// Full Leaderboard Table
const LeaderboardTable = ({
    entries,
    currentPage,
    totalPlayers,
    onPageChange
}: {
    entries: LeaderboardEntry[];
    currentPage: number;
    totalPlayers: number;
    onPageChange: (page: number) => void;
}) => {
    const itemsPerPage = 20;
    const totalPages = Math.ceil(totalPlayers / itemsPerPage);

    return (
        <div className="gamer-card overflow-hidden">
            <div className="p-4 border-b border-[#2a2a2a]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-[#ff7b00]" />
                        <h3 className="text-lg font-bold text-white">Full Leaderboard</h3>
                    </div>
                    <span className="text-sm text-[#888888]">{totalPlayers} players</span>
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 p-3 bg-[#0a0a0a] text-xs font-bold text-[#888888] uppercase">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-4">Player</div>
                <div className="col-span-2 text-center">XP</div>
                <div className="col-span-2 text-center">Win Rate</div>
                <div className="col-span-2 text-center">Games</div>
                <div className="col-span-1 text-center">Tier</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#1a1a1a]">
                {entries.map((player, index) => {
                    const tierStyle = TIER_COLORS[player.tier] || TIER_COLORS.bronze;

                    return (
                        <motion.div
                            key={player.rank}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.02 }}
                            className="grid grid-cols-12 gap-2 p-3 hover:bg-[#1a1a1a] transition-colors items-center"
                        >
                            <div className="col-span-1 text-center">
                                {player.rank <= 3 ? (
                                    <span className="text-lg">
                                        {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'}
                                    </span>
                                ) : (
                                    <span className="font-bold text-[#888888]">#{player.rank}</span>
                                )}
                            </div>
                            <div className="col-span-4 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center text-white font-bold text-sm">
                                    {player.display_name.charAt(0)}
                                </div>
                                <span className="font-medium text-white truncate">{player.display_name}</span>
                            </div>
                            <div className="col-span-2 text-center font-bold text-[#ff7b00]">
                                {player.total_xp.toLocaleString()}
                            </div>
                            <div className="col-span-2 text-center">
                                <span className={`font-medium ${player.win_rate >= 0.7 ? 'text-green-400' : player.win_rate >= 0.5 ? 'text-yellow-400' : 'text-white'}`}>
                                    {Math.round(player.win_rate * 100)}%
                                </span>
                            </div>
                            <div className="col-span-2 text-center text-[#888888]">
                                {player.games_won}/{player.total_games}
                            </div>
                            <div className="col-span-1 text-center text-lg">
                                {player.tier_badge}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-[#2a2a2a] flex items-center justify-between">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="p-2 rounded-lg bg-[#1a1a1a] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2a2a2a] transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-[#888888]">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="p-2 rounded-lg bg-[#1a1a1a] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2a2a2a] transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

// Main Leaderboard Page
export default function LeaderboardPage() {
    const { user } = useAuth();
    const [userRanking, setUserRanking] = useState<UserRanking | null>(null);
    const [topPlayers, setTopPlayers] = useState<LeaderboardEntry[]>([]);
    const [nearbyPlayers, setNearbyPlayers] = useState<LeaderboardEntry[]>([]);
    const [allPlayers, setAllPlayers] = useState<LeaderboardEntry[]>([]);
    const [tiers, setTiers] = useState<TierInfo[]>([]);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'full'>('overview');

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (activeTab === 'full') {
            loadFullLeaderboard(currentPage);
        }
    }, [currentPage, activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [rankingData, topData, nearbyData, tiersData] = await Promise.all([
                leaderboardService.getMyRanking().catch(() => null),
                leaderboardService.getTopPlayers().catch(() => ({ entries: [], total_players: 0, user_rank: 0 })),
                leaderboardService.getNearbyPlayers().catch(() => ({ entries: [], total_players: 0, user_rank: 0 })),
                leaderboardService.getTiers().catch(() => []),
            ]);

            setUserRanking(rankingData);
            setTopPlayers(topData.entries);
            setNearbyPlayers(nearbyData.entries);
            setTiers(tiersData);
            setTotalPlayers(topData.total_players);
        } catch (error) {
            console.error('Failed to load leaderboard data:', error);
            // Set fallback mock data for demo
            setTiers([
                { tier: 'bronze', name: 'Bronze', badge: '🥉', min_xp: 0, max_xp: 499 },
                { tier: 'silver', name: 'Silver', badge: '🥈', min_xp: 500, max_xp: 1499 },
                { tier: 'gold', name: 'Gold', badge: '🥇', min_xp: 1500, max_xp: 3499 },
                { tier: 'platinum', name: 'Platinum', badge: '💎', min_xp: 3500, max_xp: 7499 },
                { tier: 'diamond', name: 'Diamond', badge: '👑', min_xp: 7500, max_xp: null },
            ]);
            setUserRanking({
                rank: 42,
                total_players: 150,
                display_name: user?.display_name || 'Player',
                total_xp: 1250,
                tier: 'silver',
                tier_badge: '🥈',
                games_won: 15,
                total_games: 22,
                win_rate: 0.68,
                xp_to_next_tier: 1500,
                next_tier: 'gold',
                percentile: 72,
            });
            setTopPlayers([
                { rank: 1, user_id: '1', display_name: 'WordMaster', email: '', first_name: '', last_name: '', total_xp: 8500, games_won: 95, total_games: 100, win_rate: 0.95, average_moves: 3.2, tier: 'diamond', tier_badge: '👑' },
                { rank: 2, user_id: '2', display_name: 'ChainQueen', email: '', first_name: '', last_name: '', total_xp: 7800, games_won: 88, total_games: 95, win_rate: 0.93, average_moves: 3.5, tier: 'diamond', tier_badge: '👑' },
                { rank: 3, user_id: '3', display_name: 'VocabKing', email: '', first_name: '', last_name: '', total_xp: 6200, games_won: 75, total_games: 85, win_rate: 0.88, average_moves: 3.8, tier: 'platinum', tier_badge: '💎' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const loadFullLeaderboard = async (page: number) => {
        try {
            const offset = (page - 1) * 20;
            const data = await leaderboardService.getLeaderboard(20, offset);
            setAllPlayers(data.entries);
            setTotalPlayers(data.total_players);
        } catch (error) {
            console.error('Failed to load full leaderboard:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#ff7b00]/30 border-t-[#ff7b00] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[#888888]">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-8">
            {/* Header */}
            <div className="mb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h1 className="text-3xl font-black text-white flex items-center gap-3">
                            <Trophy className="w-8 h-8 text-[#ff7b00]" />
                            Leaderboard
                        </h1>
                        <p className="text-[#888888] mt-1">Compete, climb, and conquer!</p>
                    </div>
                    <Link href="/game" className="gamer-btn-primary flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Play Now
                    </Link>
                </motion.div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
                {[
                    { id: 'overview', label: 'Overview', icon: Star },
                    { id: 'full', label: 'Full Rankings', icon: Trophy },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                            ? 'bg-[#ff7b00] text-white'
                            : 'bg-[#1a1a1a] text-[#888888] hover:text-white hover:bg-[#2a2a2a]'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' ? (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                    >
                        {/* User Rank Hero */}
                        <UserRankHero ranking={userRanking} />

                        {/* Top 3 Podium */}
                        {topPlayers.length >= 3 && (
                            <div className="gamer-card p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Crown className="w-5 h-5 text-yellow-500" />
                                    <h3 className="text-lg font-bold text-white">Top Champions</h3>
                                </div>
                                <TopThreePodium entries={topPlayers} />
                            </div>
                        )}

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Nearby Players */}
                            {nearbyPlayers.length > 0 && (
                                <NearbyPlayers entries={nearbyPlayers} userRank={userRanking?.rank || 0} />
                            )}

                            {/* Tier Progression */}
                            <TierProgression tiers={tiers} currentTier={userRanking?.tier || 'bronze'} />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="full"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <LeaderboardTable
                            entries={allPlayers.length > 0 ? allPlayers : topPlayers}
                            currentPage={currentPage}
                            totalPlayers={totalPlayers}
                            onPageChange={setCurrentPage}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
