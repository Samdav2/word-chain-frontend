'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Lock, Save, Camera, Shield,
    Award, Calendar, Hash, Edit2, CheckCircle2,
    AlertCircle, Loader2, LogOut, Zap, Trophy,
    Target, Flame, TrendingUp, Crown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import userService, { UserProfile, DashboardStats } from '@/services/userService';
import { useRouter } from 'next/navigation';
import XPProgressBar from '@/components/dashboard/XPProgressBar';
import GamingStatsCard from '@/components/dashboard/GamingStatsCard';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'overview' | 'security'>('overview');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const [profileData, statsData] = await Promise.all([
                userService.getProfile(),
                userService.getDashboardStats()
            ]);
            setProfile(profileData);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            setSaving(false);
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
            setSaving(false);
            return;
        }

        try {
            await userService.changePassword(currentPassword, newPassword);
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.detail || 'Failed to change password. Check your current password.' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-[#ff7b00] animate-spin" />
                    <p className="text-[#888888]">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] pb-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-b border-[#222222]">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

                <div className="relative max-w-4xl mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative"
                        >
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00] p-1">
                                <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]">
                                            <svg className="w-16 h-16 text-[#555555]" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 p-2 rounded-full bg-[#ff7b00] text-white shadow-lg">
                                <Crown className="w-4 h-4" />
                            </div>
                        </motion.div>

                        {/* Info */}
                        <div className="text-center md:text-left flex-1">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-2xl md:text-3xl font-bold text-white mb-2"
                            >
                                {profile?.full_name}
                            </motion.h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-[#888888]">
                                <div className="flex items-center gap-1.5">
                                    <Mail className="w-4 h-4" />
                                    <span className="truncate max-w-[200px]">{profile?.email}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Hash className="w-4 h-4" />
                                    {profile?.matric_no || 'No Matric No'}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    Joined {new Date(profile?.created_at || '').toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="w-full md:w-64 space-y-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview'
                                ? 'bg-[#1a1a1a] text-white border border-[#333333]'
                                : 'text-[#888888] hover:bg-[#111111] hover:text-white'
                                }`}
                        >
                            <User className="w-5 h-5" />
                            <span className="font-medium">Overview</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'security'
                                ? 'bg-[#1a1a1a] text-white border border-[#333333]'
                                : 'text-[#888888] hover:bg-[#111111] hover:text-white'
                                }`}
                        >
                            <Shield className="w-5 h-5" />
                            <span className="font-medium">Security</span>
                        </button>

                        <div className="pt-4 mt-4 border-t border-[#222222]">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#ff3d3d] hover:bg-[#ff3d3d]/10 transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                                        }`}
                                >
                                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    <p className="text-sm font-medium">{message.text}</p>
                                </motion.div>
                            )}

                            {activeTab === 'overview' ? (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Level Progress */}
                                    <div className="gamer-card p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                                <Crown className="w-5 h-5 text-[#ff7b00]" />
                                                Level Progress
                                            </h2>
                                            <span className="text-2xl font-black text-[#ff7b00]">Lvl {stats?.level || 1}</span>
                                        </div>
                                        <XPProgressBar
                                            currentXP={stats?.current_xp || 0}
                                            maxXP={stats?.xp_to_next_level || 1000}
                                            level={stats?.level || 1}
                                        />
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <GamingStatsCard
                                            title="Total XP"
                                            value={(stats?.total_xp || 0).toLocaleString()}
                                            icon={<Zap className="w-6 h-6" />}
                                            variant="orange"
                                        />
                                        <GamingStatsCard
                                            title="Global Rank"
                                            value={`#${stats?.global_rank || '-'}`}
                                            icon={<Trophy className="w-6 h-6" />}
                                            trend={stats?.rank_percentile}
                                            trendUp={true}
                                            variant="white"
                                        />
                                        <GamingStatsCard
                                            title="Win Streak"
                                            value={stats?.current_win_streak || 0}
                                            icon={<Flame className="w-6 h-6" />}
                                            trend={`Best: ${stats?.best_win_streak || 0}`}
                                            trendUp={true}
                                            variant="red"
                                        />
                                        <GamingStatsCard
                                            title="Words Mastered"
                                            value={stats?.words_mastered || 0}
                                            icon={<Target className="w-6 h-6" />}
                                            variant="white"
                                        />
                                    </div>

                                    {/* Additional Stats */}
                                    <div className="gamer-card p-6">
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-green-500" />
                                            Performance
                                        </h3>
                                        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                                            <div>
                                                <div className="text-lg sm:text-2xl font-bold text-white">{profile?.games_won || 0}</div>
                                                <div className="text-[10px] sm:text-xs text-[#888888] uppercase mt-1">Wins</div>
                                            </div>
                                            <div>
                                                <div className="text-lg sm:text-2xl font-bold text-white">{(profile?.win_rate || 0).toFixed(2)}%</div>
                                                <div className="text-[10px] sm:text-xs text-[#888888] uppercase mt-1">Win Rate</div>
                                            </div>
                                            <div>
                                                <div className="text-lg sm:text-2xl font-bold text-white">{profile?.total_moves || 0}</div>
                                                <div className="text-[10px] sm:text-xs text-[#888888] uppercase mt-1">Total Moves</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="gamer-card p-6 md:p-8"
                                >
                                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Lock className="w-5 h-5 text-[#ff7b00]" />
                                        Change Password
                                    </h2>

                                    <form onSubmit={handleChangePassword} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-[#888888]">Current Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                                <input
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    className="w-full bg-[#0a0a0a] border border-[#333333] rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#ff7b00] transition-colors"
                                                    placeholder="Enter current password"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-[#888888]">New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full bg-[#0a0a0a] border border-[#333333] rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#ff7b00] transition-colors"
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-[#888888]">Confirm New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full bg-[#0a0a0a] border border-[#333333] rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#ff7b00] transition-colors"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="w-full md:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00] text-white font-bold hover:shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {saving ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4" />
                                                        Update Password
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
