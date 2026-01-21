'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, User, ArrowRight, GraduationCap } from 'lucide-react';
import api from '@/services/api';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        matric_no: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

        if (!formData.full_name) newErrors.full_name = 'Full name is required';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await api.post('/auth/signup', {
                email: formData.email,
                full_name: formData.full_name,
                matric_no: formData.matric_no || undefined,
                password: formData.password,
            });
            router.push('/login?registered=true');
        } catch (error: any) {
            console.error('Signup error:', error);
            setErrors({ form: error.response?.data?.detail || 'Signup failed. Please try again.' });
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
                        <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
                        <p className="text-[#888888]">Join the word chain challenge</p>
                    </div>

                    {errors.form && (
                        <div className="bg-[#ff3d3d]/10 border border-[#ff3d3d]/30 text-[#ff3d3d] text-sm p-3 rounded-lg mb-4">
                            {errors.form}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                                <input
                                    name="full_name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className={`w-full bg-[#0a0a0a] border ${errors.full_name ? 'border-[#ff3d3d]' : 'border-[#2a2a2a]'} rounded-lg pl-12 pr-4 py-3 text-white placeholder-[#666666] focus:border-[#ff7b00] focus:outline-none transition-colors`}
                                />
                            </div>
                            {errors.full_name && <p className="text-xs text-[#ff3d3d] mt-1">{errors.full_name}</p>}
                        </div>

                        {/* Email */}
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

                        {/* Matric No (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Matric Number <span className="text-[#666666]">(optional)</span>
                            </label>
                            <div className="relative">
                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                                <input
                                    name="matric_no"
                                    type="text"
                                    placeholder="190401001"
                                    value={formData.matric_no}
                                    onChange={handleChange}
                                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg pl-12 pr-4 py-3 text-white placeholder-[#666666] focus:border-[#ff7b00] focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Password</label>
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

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full bg-[#0a0a0a] border ${errors.confirmPassword ? 'border-[#ff3d3d]' : 'border-[#2a2a2a]'} rounded-lg pl-12 pr-4 py-3 text-white placeholder-[#666666] focus:border-[#ff7b00] focus:outline-none transition-colors`}
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-[#ff3d3d] mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="gamer-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-[#888888]">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#ff7b00] hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
