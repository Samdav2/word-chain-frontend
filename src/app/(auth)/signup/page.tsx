'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Zap, Mail, Lock, Eye, EyeOff, User, ArrowRight,
    GraduationCap, CheckCircle, XCircle, Sparkles
} from 'lucide-react';
import api from '@/services/api';

// Floating particles component
const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#ff7b00]/30 rounded-full"
                initial={{
                    x: Math.random() * 100 + '%',
                    y: '100%',
                    opacity: 0
                }}
                animate={{
                    y: '-10%',
                    opacity: [0, 1, 0],
                }}
                transition={{
                    duration: Math.random() * 5 + 5,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: 'linear'
                }}
            />
        ))}
    </div>
);

// Password strength indicator
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    const strength = useMemo(() => {
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    }, [password]);

    const getColor = () => {
        if (strength <= 1) return 'bg-red-500';
        if (strength <= 2) return 'bg-orange-500';
        if (strength <= 3) return 'bg-yellow-500';
        if (strength <= 4) return 'bg-lime-500';
        return 'bg-green-500';
    };

    const getLabel = () => {
        if (strength <= 1) return 'Weak';
        if (strength <= 2) return 'Fair';
        if (strength <= 3) return 'Good';
        if (strength <= 4) return 'Strong';
        return 'Excellent';
    };

    if (!password) return null;

    return (
        <div className="mt-2">
            <div className="flex gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${i < strength ? getColor() : 'bg-[#2a2a2a]'
                            }`}
                    />
                ))}
            </div>
            <p className={`text-xs ${strength >= 3 ? 'text-green-400' : 'text-[#888888]'}`}>
                Password strength: {getLabel()}
            </p>
        </div>
    );
};

export default function SignupPage() {
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        matric_no: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const router = useRouter();

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

        if (!formData.first_name) newErrors.first_name = 'First name is required';
        if (!formData.last_name) newErrors.last_name = 'Last name is required';

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
                first_name: formData.first_name,
                last_name: formData.last_name,
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

    const validateStep1 = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.first_name) newErrors.first_name = 'First name is required';
        if (!formData.last_name) newErrors.last_name = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        }
    };

    return (
        <div className="gamistic-theme gamistic-container min-h-screen flex items-center justify-center p-6 relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff3d3d]/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff7b00]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#ff3d3d]/5 to-[#ff7b00]/5 rounded-full blur-3xl" />
            </div>
            <FloatingParticles />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <motion.div
                        whileHover={{ rotate: 180, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00] flex items-center justify-center shadow-lg shadow-[#ff3d3d]/20"
                    >
                        <Zap className="w-8 h-8 text-white" />
                    </motion.div>
                    <span className="text-2xl font-black text-white">WordChain<span className="text-[#ff7b00]">Pro</span></span>
                </Link>

                {/* Form Card */}
                <motion.div
                    layout
                    className="gamer-card p-8 relative overflow-hidden"
                >
                    {/* Top gradient bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00]" />

                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center gap-2 bg-[#ff7b00]/10 border border-[#ff7b00]/30 rounded-full px-4 py-1.5 mb-4"
                        >
                            <Sparkles className="w-4 h-4 text-[#ff7b00]" />
                            <span className="text-sm text-[#ff7b00] font-medium">Join 10,000+ Players</span>
                        </motion.div>
                        <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
                        <p className="text-[#888888]">Start your word chain journey</p>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className={`w-3 h-3 rounded-full transition-colors ${step >= 1 ? 'bg-[#ff7b00]' : 'bg-[#2a2a2a]'}`} />
                        <div className={`w-8 h-0.5 transition-colors ${step >= 2 ? 'bg-[#ff7b00]' : 'bg-[#2a2a2a]'}`} />
                        <div className={`w-3 h-3 rounded-full transition-colors ${step >= 2 ? 'bg-[#ff7b00]' : 'bg-[#2a2a2a]'}`} />
                    </div>

                    {errors.form && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#ff3d3d]/10 border border-[#ff3d3d]/30 text-[#ff3d3d] text-sm p-3 rounded-lg mb-4 flex items-center gap-2"
                        >
                            <XCircle className="w-4 h-4 flex-shrink-0" />
                            {errors.form}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                {/* First Name & Last Name Row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">First Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                                            <input
                                                name="first_name"
                                                type="text"
                                                placeholder="John"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                className={`w-full bg-[#0a0a0a] border ${errors.first_name ? 'border-[#ff3d3d]' : 'border-[#2a2a2a]'} rounded-lg pl-10 pr-3 py-3 text-white placeholder-[#666666] focus:border-[#ff7b00] focus:outline-none transition-all focus:ring-2 focus:ring-[#ff7b00]/20`}
                                            />
                                        </div>
                                        {errors.first_name && <p className="text-xs text-[#ff3d3d] mt-1">{errors.first_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white mb-2">Last Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                                            <input
                                                name="last_name"
                                                type="text"
                                                placeholder="Doe"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                className={`w-full bg-[#0a0a0a] border ${errors.last_name ? 'border-[#ff3d3d]' : 'border-[#2a2a2a]'} rounded-lg pl-10 pr-3 py-3 text-white placeholder-[#666666] focus:border-[#ff7b00] focus:outline-none transition-all focus:ring-2 focus:ring-[#ff7b00]/20`}
                                            />
                                        </div>
                                        {errors.last_name && <p className="text-xs text-[#ff3d3d] mt-1">{errors.last_name}</p>}
                                    </div>
                                </div>

                                {/* Email */}
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
                                        {formData.email && /\S+@\S+\.\S+/.test(formData.email) && (
                                            <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                        )}
                                    </div>
                                    {errors.email && <p className="text-xs text-[#ff3d3d] mt-1">{errors.email}</p>}
                                </div>

                                {/* Matric No (Optional) */}
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Matric Number <span className="text-[#666666] font-normal">(optional)</span>
                                    </label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                                        <input
                                            name="matric_no"
                                            type="text"
                                            placeholder="2020/001"
                                            value={formData.matric_no}
                                            onChange={handleChange}
                                            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg pl-12 pr-4 py-3 text-white placeholder-[#666666] focus:border-[#ff7b00] focus:outline-none transition-all focus:ring-2 focus:ring-[#ff7b00]/20"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    type="button"
                                    onClick={nextStep}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="gamer-btn-primary w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 text-sm sm:text-base"
                                >
                                    Continue
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
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
                                    <PasswordStrengthIndicator password={formData.password} />
                                    {errors.password && <p className="text-xs text-[#ff3d3d] mt-1">{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                                        <input
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full bg-[#0a0a0a] border ${errors.confirmPassword ? 'border-[#ff3d3d]' : 'border-[#2a2a2a]'} rounded-lg pl-12 pr-12 py-3 text-white placeholder-[#666666] focus:border-[#ff7b00] focus:outline-none transition-all focus:ring-2 focus:ring-[#ff7b00]/20`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                            <CheckCircle className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                        )}
                                    </div>
                                    {errors.confirmPassword && <p className="text-xs text-[#ff3d3d] mt-1">{errors.confirmPassword}</p>}
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-full sm:w-auto sm:flex-1 py-2.5 sm:py-3 px-4 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors font-medium text-sm sm:text-base"
                                    >
                                        Back
                                    </button>
                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full sm:w-auto sm:flex-[2] gamer-btn-primary flex items-center justify-center gap-2 py-2.5 sm:py-3 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span className="hidden xs:inline">Creating...</span>
                                                <span className="xs:hidden">...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Create Account</span>
                                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-[#888888] whitespace-nowrap text-sm sm:text-base">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#ff7b00] hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>

                {/* Features */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    {[
                        { label: 'Free Forever', icon: '✨' },
                        { label: 'Daily Rewards', icon: '🎁' },
                        { label: 'Compete & Win', icon: '🏆' },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="text-[#888888] text-sm"
                        >
                            <span className="text-xl">{feature.icon}</span>
                            <p className="mt-1">{feature.label}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
