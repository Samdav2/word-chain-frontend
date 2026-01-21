'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import api from '@/services/api';

function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
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
                login(response.data.access_token, userResponse.data);
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
        <div className="gamistic-theme gamistic-container min-h-screen flex items-center justify-center p-6">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff3d3d]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff7b00]/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00] flex items-center justify-center">
                        <Zap className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-2xl font-black text-white">WordChain<span className="text-[#ff7b00]">Pro</span></span>
                </Link>

                {/* Form Card */}
                <div className="gamer-card p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
                        <p className="text-[#888888]">Continue your word chain journey</p>
                    </div>

                    {errors.success && (
                        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm p-3 rounded-lg mb-4">
                            {errors.success}
                        </div>
                    )}

                    {errors.form && (
                        <div className="bg-[#ff3d3d]/10 border border-[#ff3d3d]/30 text-[#ff3d3d] text-sm p-3 rounded-lg mb-4">
                            {errors.form}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="student@lasu.edu.ng"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full bg-[#0a0a0a] border ${errors.email ? 'border-[#ff3d3d]' : 'border-[#2a2a2a]'} rounded-lg pl-12 pr-4 py-3 text-white placeholder-[#666666] focus:border-[#ff7b00] focus:outline-none transition-colors`}
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
                                    className={`w-full bg-[#0a0a0a] border ${errors.password ? 'border-[#ff3d3d]' : 'border-[#2a2a2a]'} rounded-lg pl-12 pr-12 py-3 text-white placeholder-[#666666] focus:border-[#ff7b00] focus:outline-none transition-colors`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-[#ff3d3d] mt-1">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="gamer-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
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
