'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, Lock, Eye, EyeOff, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import api from '@/services/api';

function ResetPasswordForm() {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError('Invalid reset link. Please request a new password reset.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.post('/auth/password-reset/confirm', {
                token,
                new_password: formData.password,
            });
            setSuccess(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to reset password. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="gamistic-theme gamistic-container min-h-screen flex items-center justify-center p-6">
                <div className="gamer-card p-8 text-center max-w-md">
                    <XCircle className="w-16 h-16 text-[#ff3d3d] mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Invalid Reset Link</h2>
                    <p className="text-[#888888] mb-6">
                        This password reset link is invalid or has expired.
                    </p>
                    <Link href="/forgot-password" className="gamer-btn-primary inline-flex items-center gap-2">
                        Request New Link
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="gamistic-theme gamistic-container min-h-screen flex items-center justify-center p-6">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff3d3d]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff7b00]/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00] flex items-center justify-center">
                        <Zap className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl font-black text-white">WordChain<span className="text-[#ff7b00]">Pro</span></span>
                </Link>

                <div className="gamer-card p-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00]" />

                    {!success ? (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-black text-white mb-2">Reset Password</h1>
                                <p className="text-[#888888]">Enter your new password</p>
                            </div>

                            {error && (
                                <div className="bg-[#ff3d3d]/10 border border-[#ff3d3d]/30 text-[#ff3d3d] text-sm p-3 rounded-lg mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg pl-12 pr-12 py-3 text-white placeholder-[#666666] focus:border-[#ff7b00] focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg pl-12 pr-4 py-3 text-white placeholder-[#666666] focus:border-[#ff7b00] focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="gamer-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Resetting...
                                        </>
                                    ) : (
                                        <>
                                            Reset Password
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Password Reset!</h2>
                            <p className="text-[#888888]">
                                Your password has been changed. Redirecting to login...
                            </p>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="gamistic-theme gamistic-container min-h-screen flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
