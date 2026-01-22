'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Award, Star, Target, Zap, Flame, Crown, Gift,
    Medal, Sparkles, Lock, CheckCircle2, Clock, Calendar,
    TrendingUp, Brain, Lightbulb, Shield, Gem, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import userService, { DashboardStats } from '@/services/userService';

// Achievement categories and definitions
interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    category: 'games' | 'xp' | 'streaks' | 'mastery' | 'special';
    requirement: number;
    currentProgress: number;
    xpReward: number;
    unlocked: boolean;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface DailyReward {
    day: number;
    reward: { type: 'xp' | 'coins' | 'stars'; amount: number };
    claimed: boolean;
    available: boolean;
}

// Rarity colors
const rarityColors = {
    common: { bg: 'from-gray-500/20 to-gray-600/20', border: 'border-gray-500/30', text: 'text-gray-400', glow: '' },
    rare: { bg: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
    epic: { bg: 'from-purple-500/20 to-purple-600/20', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/30' },
    legendary: { bg: 'from-amber-500/20 to-orange-600/20', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/40' },
};

const categoryIcons = {
    games: <Target className="w-5 h-5" />,
    xp: <Star className="w-5 h-5" />,
    streaks: <Flame className="w-5 h-5" />,
    mastery: <Brain className="w-5 h-5" />,
    special: <Crown className="w-5 h-5" />,
};

// Achievement Card Component
function AchievementCard({ achievement }: { achievement: Achievement }) {
    const colors = rarityColors[achievement.rarity];
    const progress = Math.min((achievement.currentProgress / achievement.requirement) * 100, 100);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: achievement.unlocked ? 1.02 : 1 }}
            className={`relative p-4 rounded-xl border ${colors.border} bg-gradient-to-br ${colors.bg} ${achievement.unlocked ? `shadow-lg ${colors.glow}` : 'opacity-75'} transition-all duration-300`}
        >
            {/* Unlocked Badge */}
            {achievement.unlocked && (
                <div className="absolute -top-2 -right-2 z-10">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                </div>
            )}

            {/* Locked Overlay */}
            {!achievement.unlocked && (
                <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center z-10">
                    <Lock className="w-8 h-8 text-gray-400" />
                </div>
            )}

            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`p-3 rounded-lg bg-[#0a0a0a] ${colors.text}`}>
                    {achievement.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white text-sm truncate">{achievement.name}</h3>
                        <span className={`text-[10px] uppercase font-bold ${colors.text} px-1.5 py-0.5 rounded bg-black/30`}>
                            {achievement.rarity}
                        </span>
                    </div>
                    <p className="text-xs text-[#888888] mb-2 line-clamp-2">{achievement.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-2">
                        <div className="flex justify-between text-[10px] text-[#666666] mb-1">
                            <span>{achievement.currentProgress} / {achievement.requirement}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className={`h-full rounded-full ${achievement.unlocked ? 'bg-green-500' : 'bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00]'}`}
                            />
                        </div>
                    </div>

                    {/* Reward */}
                    <div className="flex items-center gap-1.5 text-xs">
                        <Gift className="w-3.5 h-3.5 text-[#ff7b00]" />
                        <span className="text-[#ff7b00] font-semibold">+{achievement.xpReward} XP</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Daily Reward Card Component
function DailyRewardCard({ reward, onClaim }: { reward: DailyReward; onClaim: () => void }) {
    const isToday = reward.available && !reward.claimed;

    return (
        <motion.div
            whileHover={isToday ? { scale: 1.05, y: -5 } : {}}
            whileTap={isToday ? { scale: 0.95 } : {}}
            onClick={isToday ? onClaim : undefined}
            className={`relative flex flex-col items-center p-3 rounded-xl border transition-all duration-300 ${reward.claimed
                ? 'bg-green-500/10 border-green-500/30'
                : isToday
                    ? 'bg-gradient-to-b from-[#ff3d3d]/20 to-[#ff7b00]/20 border-[#ff7b00]/50 cursor-pointer shadow-lg shadow-orange-500/20 animate-pulse'
                    : 'bg-[#111111] border-[#222222] opacity-50'
                }`}
        >
            {/* Day Badge */}
            <span className={`text-[10px] font-bold uppercase mb-2 ${reward.claimed ? 'text-green-400' : isToday ? 'text-[#ff7b00]' : 'text-[#666666]'}`}>
                Day {reward.day}
            </span>

            {/* Reward Icon */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${reward.claimed ? 'bg-green-500/20' : isToday ? 'bg-[#ff7b00]/20' : 'bg-[#1a1a1a]'
                }`}>
                {reward.claimed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : reward.reward.type === 'xp' ? (
                    <Zap className={`w-5 h-5 ${isToday ? 'text-[#ff7b00]' : 'text-[#666666]'}`} />
                ) : reward.reward.type === 'coins' ? (
                    <Gem className={`w-5 h-5 ${isToday ? 'text-yellow-400' : 'text-[#666666]'}`} />
                ) : (
                    <Star className={`w-5 h-5 ${isToday ? 'text-purple-400' : 'text-[#666666]'}`} />
                )}
            </div>

            {/* Reward Amount */}
            <span className={`text-sm font-bold ${reward.claimed ? 'text-green-400' : isToday ? 'text-white' : 'text-[#666666]'}`}>
                +{reward.reward.amount}
            </span>
            <span className={`text-[10px] ${reward.claimed ? 'text-green-400/70' : isToday ? 'text-[#888888]' : 'text-[#555555]'}`}>
                {reward.reward.type.toUpperCase()}
            </span>

            {/* Claim Button */}
            {isToday && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#ff7b00] text-black text-[9px] font-bold px-2 py-0.5 rounded-full"
                >
                    CLAIM!
                </motion.span>
            )}
        </motion.div>
    );
}

// Tier Reward Component
function TierReward({ tier, currentXP }: { tier: { name: string; minXP: number; color: string; reward: string }; currentXP: number }) {
    const unlocked = currentXP >= tier.minXP;

    return (
        <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${unlocked
            ? 'bg-gradient-to-r from-green-500/10 to-transparent border-green-500/30'
            : 'bg-[#111111] border-[#222222] opacity-60'
            }`}>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${unlocked ? 'bg-green-500/20' : 'bg-[#1a1a1a]'}`}>
                {unlocked ? (
                    <Shield className="w-6 h-6 text-green-400" />
                ) : (
                    <Lock className="w-6 h-6 text-[#666666]" />
                )}
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className={`font-bold ${unlocked ? 'text-white' : 'text-[#888888]'}`} style={{ color: unlocked ? tier.color : undefined }}>
                        {tier.name}
                    </span>
                    {unlocked && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                </div>
                <p className="text-xs text-[#666666]">{tier.minXP.toLocaleString()} XP required</p>
            </div>
            <div className="text-right">
                <span className={`text-sm font-semibold ${unlocked ? 'text-[#ff7b00]' : 'text-[#666666]'}`}>
                    {tier.reward}
                </span>
            </div>
        </div>
    );
}

// Inner component that uses useSearchParams
function AchievementsContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const initialTab = tabParam === 'daily' ? 'daily' : tabParam === 'tiers' ? 'tiers' : 'achievements';

    const [activeTab, setActiveTab] = useState<'achievements' | 'daily' | 'tiers'>(initialTab);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [claimedToday, setClaimedToday] = useState(false);
    const [showClaimAnimation, setShowClaimAnimation] = useState(false);


    useEffect(() => {
        async function fetchData() {
            try {
                const dashboardStats = await userService.getDashboardStats();
                setStats(dashboardStats);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Generate achievements based on user stats
    const achievements: Achievement[] = stats ? [
        // Games Achievements
        { id: 'first_win', name: 'First Victory', description: 'Win your first word chain game', icon: <Trophy className="w-5 h-5" />, category: 'games', requirement: 1, currentProgress: Math.min(stats.words_mastered > 0 ? 1 : 0, 1), xpReward: 50, unlocked: stats.words_mastered > 0, rarity: 'common' },
        { id: 'ten_wins', name: 'Getting Started', description: 'Win 10 word chain games', icon: <Target className="w-5 h-5" />, category: 'games', requirement: 10, currentProgress: Math.min(stats.words_mastered, 10), xpReward: 150, unlocked: stats.words_mastered >= 10, rarity: 'common' },
        { id: 'fifty_wins', name: 'Dedicated Player', description: 'Win 50 word chain games', icon: <Medal className="w-5 h-5" />, category: 'games', requirement: 50, currentProgress: Math.min(stats.words_mastered, 50), xpReward: 500, unlocked: stats.words_mastered >= 50, rarity: 'rare' },
        { id: 'hundred_wins', name: 'Word Chain Master', description: 'Win 100 word chain games', icon: <Crown className="w-5 h-5" />, category: 'games', requirement: 100, currentProgress: Math.min(stats.words_mastered, 100), xpReward: 1000, unlocked: stats.words_mastered >= 100, rarity: 'epic' },

        // XP Achievements
        { id: 'xp_1k', name: 'Rising Star', description: 'Earn 1,000 total XP', icon: <Star className="w-5 h-5" />, category: 'xp', requirement: 1000, currentProgress: Math.min(stats.total_xp, 1000), xpReward: 100, unlocked: stats.total_xp >= 1000, rarity: 'common' },
        { id: 'xp_5k', name: 'XP Collector', description: 'Earn 5,000 total XP', icon: <Sparkles className="w-5 h-5" />, category: 'xp', requirement: 5000, currentProgress: Math.min(stats.total_xp, 5000), xpReward: 300, unlocked: stats.total_xp >= 5000, rarity: 'rare' },
        { id: 'xp_10k', name: 'XP Hunter', description: 'Earn 10,000 total XP', icon: <Zap className="w-5 h-5" />, category: 'xp', requirement: 10000, currentProgress: Math.min(stats.total_xp, 10000), xpReward: 750, unlocked: stats.total_xp >= 10000, rarity: 'epic' },
        { id: 'xp_50k', name: 'XP Legend', description: 'Earn 50,000 total XP', icon: <Crown className="w-5 h-5" />, category: 'xp', requirement: 50000, currentProgress: Math.min(stats.total_xp, 50000), xpReward: 2500, unlocked: stats.total_xp >= 50000, rarity: 'legendary' },

        // Streak Achievements
        { id: 'streak_3', name: 'On Fire', description: 'Achieve a 3-game win streak', icon: <Flame className="w-5 h-5" />, category: 'streaks', requirement: 3, currentProgress: Math.min(stats.best_win_streak, 3), xpReward: 100, unlocked: stats.best_win_streak >= 3, rarity: 'common' },
        { id: 'streak_5', name: 'Unstoppable', description: 'Achieve a 5-game win streak', icon: <Flame className="w-5 h-5" />, category: 'streaks', requirement: 5, currentProgress: Math.min(stats.best_win_streak, 5), xpReward: 250, unlocked: stats.best_win_streak >= 5, rarity: 'rare' },
        { id: 'streak_10', name: 'Dominator', description: 'Achieve a 10-game win streak', icon: <Flame className="w-5 h-5" />, category: 'streaks', requirement: 10, currentProgress: Math.min(stats.best_win_streak, 10), xpReward: 750, unlocked: stats.best_win_streak >= 10, rarity: 'epic' },

        // Mastery Achievements
        { id: 'level_5', name: 'Apprentice', description: 'Reach Level 5', icon: <Brain className="w-5 h-5" />, category: 'mastery', requirement: 5, currentProgress: Math.min(stats.level, 5), xpReward: 200, unlocked: stats.level >= 5, rarity: 'common' },
        { id: 'level_10', name: 'Scholar', description: 'Reach Level 10', icon: <Brain className="w-5 h-5" />, category: 'mastery', requirement: 10, currentProgress: Math.min(stats.level, 10), xpReward: 500, unlocked: stats.level >= 10, rarity: 'rare' },
        { id: 'level_25', name: 'Prodigy', description: 'Reach Level 25', icon: <Lightbulb className="w-5 h-5" />, category: 'mastery', requirement: 25, currentProgress: Math.min(stats.level, 25), xpReward: 1500, unlocked: stats.level >= 25, rarity: 'epic' },
        { id: 'level_50', name: 'Grandmaster', description: 'Reach Level 50', icon: <Crown className="w-5 h-5" />, category: 'mastery', requirement: 50, currentProgress: Math.min(stats.level, 50), xpReward: 5000, unlocked: stats.level >= 50, rarity: 'legendary' },

        // Special Achievements
        { id: 'top_10', name: 'Elite Player', description: 'Reach Top 10% on the leaderboard', icon: <Award className="w-5 h-5" />, category: 'special', requirement: 10, currentProgress: 100 - parseFloat(stats.rank_percentile || '100'), xpReward: 1000, unlocked: parseFloat(stats.rank_percentile || '100') <= 10, rarity: 'epic' },
        { id: 'top_1', name: 'The Champion', description: 'Reach Top 1% on the leaderboard', icon: <Crown className="w-5 h-5" />, category: 'special', requirement: 1, currentProgress: 100 - parseFloat(stats.rank_percentile || '100'), xpReward: 5000, unlocked: parseFloat(stats.rank_percentile || '100') <= 1, rarity: 'legendary' },
    ] : [];

    // Daily rewards (7-day cycle)
    const currentDay = new Date().getDay() || 7; // 1-7, Sunday = 7
    const dailyRewards: DailyReward[] = [
        { day: 1, reward: { type: 'xp' as const, amount: 25 }, claimed: currentDay > 1, available: currentDay >= 1 },
        { day: 2, reward: { type: 'coins' as const, amount: 10 }, claimed: currentDay > 2, available: currentDay >= 2 },
        { day: 3, reward: { type: 'xp' as const, amount: 50 }, claimed: currentDay > 3, available: currentDay >= 3 },
        { day: 4, reward: { type: 'stars' as const, amount: 1 }, claimed: currentDay > 4, available: currentDay >= 4 },
        { day: 5, reward: { type: 'xp' as const, amount: 75 }, claimed: currentDay > 5, available: currentDay >= 5 },
        { day: 6, reward: { type: 'coins' as const, amount: 25 }, claimed: currentDay > 6, available: currentDay >= 6 },
        { day: 7, reward: { type: 'xp' as const, amount: 150 }, claimed: false, available: currentDay >= 7 },
    ].map((r, i) => ({
        ...r,
        claimed: i < currentDay - 1 || (i === currentDay - 1 && claimedToday),
        available: i < currentDay
    }));

    // Tier rewards
    const tierRewards = [
        { name: 'Bronze', minXP: 0, color: '#cd7f32', reward: 'Access to Game' },
        { name: 'Silver', minXP: 500, color: '#c0c0c0', reward: '+5% XP Bonus' },
        { name: 'Gold', minXP: 2000, color: '#ffd700', reward: '+10% XP Bonus' },
        { name: 'Platinum', minXP: 5000, color: '#e5e4e2', reward: '+15% XP Bonus' },
        { name: 'Diamond', minXP: 10000, color: '#b9f2ff', reward: '+20% XP Bonus' },
        { name: 'Champion', minXP: 25000, color: '#ff7b00', reward: '+25% XP + Badge' },
        { name: 'Legend', minXP: 50000, color: '#ff3d3d', reward: '+30% XP + Title' },
    ];

    const handleClaimDaily = () => {
        setClaimedToday(true);
        setShowClaimAnimation(true);
        setTimeout(() => setShowClaimAnimation(false), 2000);
    };

    const filteredAchievements = activeCategory === 'all'
        ? achievements
        : achievements.filter(a => a.category === activeCategory);

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalXPFromAchievements = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-[#ff7b00] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[#888888]">Loading achievements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] pb-20">
            {/* Claim Animation Overlay */}
            <AnimatePresence>
                {showClaimAnimation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00] flex items-center justify-center">
                                <Gift className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Reward Claimed!</h2>
                            <p className="text-[#ff7b00] text-lg font-semibold">+{dailyRewards[currentDay - 1]?.reward.amount} {dailyRewards[currentDay - 1]?.reward.type.toUpperCase()}</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-b border-[#222222]">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff7b00]/10 rounded-full blur-[100px]" />

                <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-12">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 mb-3"
                            >
                                <div className="p-2 rounded-lg bg-gradient-to-br from-[#ff3d3d]/20 to-[#ff7b00]/20 border border-[#ff7b00]/30">
                                    <Trophy className="w-6 h-6 text-[#ff7b00]" />
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">Achievements & Rewards</h1>
                            </motion.div>
                            <p className="text-[#888888] max-w-lg">
                                Unlock achievements, claim daily rewards, and earn exclusive tier bonuses as you master the Word Chain!
                            </p>
                        </div>

                        {/* Stats Summary */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex gap-4 sm:gap-6"
                        >
                            <div className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-[#ff7b00]">{unlockedCount}</div>
                                <div className="text-xs text-[#888888]">Unlocked</div>
                            </div>
                            <div className="w-px bg-[#333333]" />
                            <div className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-white">{achievements.length}</div>
                                <div className="text-xs text-[#888888]">Total</div>
                            </div>
                            <div className="w-px bg-[#333333]" />
                            <div className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-green-400">+{totalXPFromAchievements}</div>
                                <div className="text-xs text-[#888888]">XP Earned</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 mt-8 overflow-x-auto pb-2">
                        {[
                            { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
                            { id: 'daily', label: 'Daily Rewards', icon: <Calendar className="w-4 h-4" /> },
                            { id: 'tiers', label: 'Tier Rewards', icon: <TrendingUp className="w-4 h-4" /> },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00] text-white shadow-lg shadow-orange-500/20'
                                    : 'bg-[#111111] text-[#888888] hover:text-white hover:bg-[#1a1a1a]'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    {/* Achievements Tab */}
                    {activeTab === 'achievements' && (
                        <motion.div
                            key="achievements"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Category Filter */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {[
                                    { id: 'all', label: 'All' },
                                    { id: 'games', label: 'Games', icon: categoryIcons.games },
                                    { id: 'xp', label: 'XP', icon: categoryIcons.xp },
                                    { id: 'streaks', label: 'Streaks', icon: categoryIcons.streaks },
                                    { id: 'mastery', label: 'Mastery', icon: categoryIcons.mastery },
                                    { id: 'special', label: 'Special', icon: categoryIcons.special },
                                ].map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeCategory === cat.id
                                            ? 'bg-[#ff7b00]/20 text-[#ff7b00] border border-[#ff7b00]/30'
                                            : 'bg-[#111111] text-[#888888] border border-[#222222] hover:border-[#333333]'
                                            }`}
                                    >
                                        {cat.icon}
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* Achievement Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredAchievements.map((achievement, index) => (
                                    <motion.div
                                        key={achievement.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <AchievementCard achievement={achievement} />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Daily Rewards Tab */}
                    {activeTab === 'daily' && (
                        <motion.div
                            key="daily"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* Weekly Login Bonus */}
                            <div className="gamer-card p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-[#ff7b00]" />
                                            Weekly Login Bonus
                                        </h2>
                                        <p className="text-sm text-[#888888] mt-1">Log in daily to claim rewards!</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-[#888888]">Resets in</div>
                                        <div className="flex items-center gap-1 text-[#ff7b00] font-mono">
                                            <Clock className="w-4 h-4" />
                                            {7 - currentDay} days
                                        </div>
                                    </div>
                                </div>

                                {/* Reward Cards */}
                                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                                    {dailyRewards.map((reward) => (
                                        <DailyRewardCard
                                            key={reward.day}
                                            reward={reward}
                                            onClaim={handleClaimDaily}
                                        />
                                    ))}
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-6">
                                    <div className="flex justify-between text-xs text-[#888888] mb-2">
                                        <span>Weekly Progress</span>
                                        <span>{dailyRewards.filter(r => r.claimed).length}/7 days</span>
                                    </div>
                                    <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(dailyRewards.filter(r => r.claimed).length / 7) * 100}%` }}
                                            className="h-full bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00] rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Streak Bonus Info */}
                            <div className="gamer-card p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Flame className="w-5 h-5 text-orange-500" />
                                    Streak Bonuses
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { days: 7, bonus: '2x XP for 1 hour', icon: <Zap /> },
                                        { days: 14, bonus: '3x XP for 2 hours', icon: <Sparkles /> },
                                        { days: 30, bonus: '5x XP for 24 hours', icon: <Crown /> },
                                    ].map((streak) => (
                                        <div key={streak.days} className="p-4 rounded-xl bg-[#0a0a0a] border border-[#222222]">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="text-[#ff7b00]">{streak.icon}</div>
                                                <span className="font-bold text-white">{streak.days} Day Streak</span>
                                            </div>
                                            <p className="text-sm text-[#888888]">{streak.bonus}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Tier Rewards Tab */}
                    {activeTab === 'tiers' && (
                        <motion.div
                            key="tiers"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="gamer-card p-6 mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-[#ff7b00]" />
                                            Tier Progression Rewards
                                        </h2>
                                        <p className="text-sm text-[#888888] mt-1">Unlock permanent bonuses as you rank up!</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0a0a0a] border border-[#222222]">
                                        <Star className="w-5 h-5 text-[#ff7b00]" />
                                        <span className="text-white font-bold">{stats?.total_xp?.toLocaleString() || 0}</span>
                                        <span className="text-[#888888] text-sm">Total XP</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {tierRewards.map((tier) => (
                                        <TierReward key={tier.name} tier={tier} currentXP={stats?.total_xp || 0} />
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <Link href="/game">
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="gamer-card p-6 flex items-center justify-between cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-gradient-to-br from-[#ff3d3d]/20 to-[#ff7b00]/20">
                                            <Zap className="w-6 h-6 text-[#ff7b00]" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">Ready to earn more XP?</h3>
                                            <p className="text-sm text-[#888888]">Start a game and climb the ranks!</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-[#666666] group-hover:text-[#ff7b00] group-hover:translate-x-1 transition-all" />
                                </motion.div>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Loading fallback for Suspense
function AchievementsLoading() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-[#ff7b00] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#888888]">Loading achievements...</p>
            </div>
        </div>
    );
}

// Default export wraps in Suspense for useSearchParams
export default function AchievementsPage() {
    return (
        <Suspense fallback={<AchievementsLoading />}>
            <AchievementsContent />
        </Suspense>
    );
}
