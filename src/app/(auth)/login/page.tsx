'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, Gamepad2, Trophy, Target } from 'lucide-react';
import api from '@/services/api';

// Floating particles
const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-[#ff7b00]/20 rounded-full"
                initial={{
                    x: Math.random() * 100 + '%',
                    y: '100%',
                    opacity: 0
                }}
                animate={{
                    y: '-10%',
                    opacity: [0, 0.5, 0],
                }}
                transition={{
                    duration: Math.random() * 6 + 4,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: 'linear'
                }}
            />
        ))}
    </div>
);

function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    React.useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setErrors({ success: 'Account created successfully! Please sign in.' });
        }
    }, [searchParams]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const formDataBody = new FormData();
            formDataBody.append('username', formData.email);
            formDataBody.append('password', formData.password);

            const response = await api.post('/auth/login', formDataBody, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                const userResponse = await api.get('/users/me');

                // Merge user data with first_name from login response
                const userData = {
                    ...userResponse.data,
                    first_name: response.data.first_name || userResponse.data.first_name || userResponse.data.full_name?.split(' ')[0] || 'User',
                    last_name: userResponse.data.last_name || '',
                    display_name: userResponse.data.full_name || response.data.first_name || 'User'
                };

                login(response.data.access_token, userData);
            }
        } catch (error: any) {
            console.error('Login error:', error);
            setErrors({ form: 'Invalid email or password.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    return (
        <div className="gamistic-theme gamistic-container min-h-screen flex flex-col lg:flex-row relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#ff3d3d]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#ff7b00]/10 rounded-full blur-3xl" />
            </div>
            <FloatingParticles />

            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 min-h-screen lg:min-h-0">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 mb-10">
                        <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.5 }}
                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00] flex items-center justify-center shadow-lg shadow-[#ff3d3d]/20"
                        >
                            <Zap className="w-7 h-7 text-white" />
                        </motion.div>
                        <span className="text-2xl font-black text-white">WordChain<span className="text-[#ff7b00]">Pro</span></span>
                    </Link>

                    {/* Form Card */}
                    <div className="gamer-card p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00]" />

                        <div className="mb-8">
                            <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
                            <p className="text-[#888888]">Continue your word chain journey</p>
                        </div>

                        {errors.success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm p-3 rounded-lg mb-4 flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                {errors.success}
                            </motion.div>
                        )}

                        {errors.form && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#ff3d3d]/10 border border-[#ff3d3d]/30 text-[#ff3d3d] text-sm p-3 rounded-lg mb-4"
                            >
                                {errors.form}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="student@university.edu"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full bg-[#0a0a0a] border ${errors.email ? 'border-[#ff3d3d]' : 'border-[#2a2a2a]'} rounded-lg pl-12 pr-4 py-3 text-white placeholder-[#666666] focus:border-[#ff7b00] focus:outline-none transition-all focus:ring-2 focus:ring-[#ff7b00]/20`}
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-[#ff3d3d] mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-white">Password</label>
                                    <Link href="/forgot-password" className="text-xs text-[#ff7b00] hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full bg-[#0a0a0a] border ${errors.password ? 'border-[#ff3d3d]' : 'border-[#2a2a2a]'} rounded-lg pl-12 pr-12 py-3 text-white placeholder-[#666666] focus:border-[#ff7b00] focus:outline-none transition-all focus:ring-2 focus:ring-[#ff7b00]/20`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-[#ff3d3d] mt-1">{errors.password}</p>}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setRememberMe(!rememberMe)}
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${rememberMe ? 'bg-[#ff7b00] border-[#ff7b00]' : 'border-[#3a3a3a] hover:border-[#ff7b00]'
                                        }`}
                                >
                                    {rememberMe && <CheckCircle className="w-3 h-3 text-white" />}
                                </button>
                                <label className="text-sm text-[#888888] cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                                    Remember me for 30 days
                                </label>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="gamer-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-[#888888]">
                                Don't have an account?{' '}
                                <Link href="/signup" className="text-[#ff7b00] hover:underline font-medium">
                                    Sign up free
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Feature Showcase (hidden on mobile) */}
            <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative">
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-lg"
                >
                    <div className="mb-8">
                        <h2 className="text-4xl font-black text-white mb-4">
                            Level Up Your <span className="glow-text-red">Vocabulary</span>
                        </h2>
                        <p className="text-[#888888] text-lg">
                            Join thousands of students mastering words through epic chains.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="space-y-4">
                        {[
                            { icon: <Gamepad2 className="w-6 h-6" />, title: 'Addictive Gameplay', desc: 'Transform words one letter at a time' },
                            { icon: <Trophy className="w-6 h-6" />, title: 'Competitive Leaderboards', desc: 'Climb the ranks and earn bragging rights' },
                            { icon: <Target className="w-6 h-6" />, title: 'Daily Challenges', desc: 'Complete missions for bonus XP rewards' },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="flex items-start gap-4 p-4 bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-xl"
                            >
                                <div className="p-2 rounded-lg bg-gradient-to-br from-[#ff3d3d]/20 to-[#ff7b00]/20 text-[#ff7b00]">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{feature.title}</h3>
                                    <p className="text-sm text-[#888888]">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="mt-8 flex gap-8"
                    >
                        {[
                            { value: '10K+', label: 'Players' },
                            { value: '50K+', label: 'Games Played' },
                            { value: '1M+', label: 'Words Chained' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl font-black text-[#ff7b00]">{stat.value}</div>
                                <div className="text-xs text-[#888888]">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="gamistic-theme gamistic-container min-h-screen flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
