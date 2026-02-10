'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Heart, Users, Target, Zap, Brain, Trophy,
    GraduationCap, Code, Gamepad2, Sparkles,
    Github, Mail, Globe, ChevronRight,
    Star, Award, BookOpen, Flame
} from 'lucide-react';

// Features list
const features = [
    {
        icon: Brain,
        title: "AI-Powered Hints",
        description: "Get intelligent suggestions powered by advanced AI when you're stuck"
    },
    {
        icon: Target,
        title: "Multiple Difficulty Levels",
        description: "From beginner-friendly Easy to challenging Hard mode"
    },
    {
        icon: Trophy,
        title: "Global Leaderboards",
        description: "Compete with players worldwide and climb the ranks"
    },
    {
        icon: BookOpen,
        title: "Word Categories",
        description: "Explore themed word sets from animals to technology"
    },
    {
        icon: Flame,
        title: "Daily Missions",
        description: "Complete challenges daily for bonus XP and rewards"
    },
    {
        icon: Award,
        title: "Tier Progression",
        description: "Rise from Bronze to Diamond as you master vocabulary"
    }
];

// Stats
const stats = [
    { value: "5", label: "Tier Levels", icon: "👑" },
    { value: "6+", label: "Categories", icon: "📚" },
    { value: "∞", label: "Word Chains", icon: "🔗" },
    { value: "24/7", label: "Available", icon: "🌍" },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen pb-12">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#2a2a2a] p-6 sm:p-10 mb-8"
            >
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#ff7b00]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#ff3d3d]/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00] flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30"
                    >
                        <span className="text-4xl">🔗</span>
                    </motion.div>

                    <h1 className="text-3xl sm:text-5xl font-black text-white mb-4">
                        About <span className="bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00] bg-clip-text text-transparent">WordChainPro</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-[#aaaaaa] max-w-2xl mb-6">
                        The ultimate vocabulary game that challenges your word skills through fun,
                        engaging chain-building puzzles. Built with passion, powered by AI.
                    </p>

                    <div className="flex items-center gap-3 text-sm text-[#888888]">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-[#ff7b00]" />
                            <span>EST 415 Project</span>
                        </div>
                        <span className="text-[#3a3a3a]">•</span>
                        <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-[#ff7b00]" />
                            <span>LASU 2024/2025</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
            >
                {stats.map((stat, index) => (
                    <div
                        key={stat.label}
                        className="gamer-card p-4 text-center"
                    >
                        <span className="text-2xl mb-2 block">{stat.icon}</span>
                        <div className="text-2xl font-black text-white">{stat.value}</div>
                        <div className="text-xs text-[#888888]">{stat.label}</div>
                    </div>
                ))}
            </motion.div>

            {/* Mission Statement */}
            <section className="mb-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="gamer-card p-6 sm:p-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Heart className="w-6 h-6 text-red-500" />
                        <h2 className="text-xl sm:text-2xl font-bold text-white">Our Mission</h2>
                    </div>
                    <p className="text-[#aaaaaa] leading-relaxed">
                        WordChainPro was created to make vocabulary building fun and engaging.
                        We believe that learning shouldn't feel like a chore. Through gamification,
                        AI-powered assistance, and competitive elements, we've built a platform
                        that makes you <em className="text-[#ff7b00]">want</em> to learn new words.
                    </p>
                    <p className="text-[#aaaaaa] leading-relaxed mt-4">
                        Whether you're a student looking to expand your vocabulary, a word game
                        enthusiast seeking a challenge, or just someone who loves language,
                        WordChainPro is designed for you.
                    </p>
                </motion.div>
            </section>

            {/* How It Works */}
            <section className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Gamepad2 className="w-6 h-6 text-[#ff7b00]" />
                    How It Works
                </h2>

                <div className="gamer-card p-6">
                    <div className="grid sm:grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center mx-auto mb-4 border-2 border-green-500/30">
                                <span className="text-2xl font-bold text-green-400">1</span>
                            </div>
                            <h3 className="font-bold text-white mb-2">Get Your Words</h3>
                            <p className="text-sm text-[#888888]">Start with a word and see your target. Your goal is to connect them!</p>
                        </div>

                        <div>
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff7b00]/20 to-[#ff3d3d]/20 flex items-center justify-center mx-auto mb-4 border-2 border-[#ff7b00]/30">
                                <span className="text-2xl font-bold text-[#ff7b00]">2</span>
                            </div>
                            <h3 className="font-bold text-white mb-2">Build Your Chain</h3>
                            <p className="text-sm text-[#888888]">Change one letter at a time to create valid words and build your chain.</p>
                        </div>

                        <div>
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center mx-auto mb-4 border-2 border-purple-500/30">
                                <span className="text-2xl font-bold text-purple-400">3</span>
                            </div>
                            <h3 className="font-bold text-white mb-2">Earn Rewards</h3>
                            <p className="text-sm text-[#888888]">Complete chains to earn XP, climb tiers, and unlock achievements!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#ff7b00]" />
                    Features
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="gamer-card p-5 hover:border-[#ff7b00]/30 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center mb-3">
                                <feature.icon className="w-5 h-5 text-[#ff7b00]" />
                            </div>
                            <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-sm text-[#888888]">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* The Team / Project */}
            <section className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#ff7b00]" />
                    The Project
                </h2>

                <div className="gamer-card p-6">
                    <p className="text-[#aaaaaa] mb-6">
                        WordChainPro is developed as part of the EST 415 Software Development course
                        at the Federal University of Technology, Akure (FUTA). This project demonstrates
                        the practical application of modern web development technologies including:
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <div className="bg-[#1a1a1a] rounded-lg p-3 text-center border border-[#2a2a2a]">
                            <div className="text-2xl mb-1">⚛️</div>
                            <div className="text-sm font-medium text-white">React</div>
                            <div className="text-xs text-[#666666]">Frontend</div>
                        </div>
                        <div className="bg-[#1a1a1a] rounded-lg p-3 text-center border border-[#2a2a2a]">
                            <div className="text-2xl mb-1">▲</div>
                            <div className="text-sm font-medium text-white">Next.js</div>
                            <div className="text-xs text-[#666666]">Framework</div>
                        </div>
                        <div className="bg-[#1a1a1a] rounded-lg p-3 text-center border border-[#2a2a2a]">
                            <div className="text-2xl mb-1">🐍</div>
                            <div className="text-sm font-medium text-white">FastAPI</div>
                            <div className="text-xs text-[#666666]">Backend</div>
                        </div>
                        <div className="bg-[#1a1a1a] rounded-lg p-3 text-center border border-[#2a2a2a]">
                            <div className="text-2xl mb-1">🤖</div>
                            <div className="text-sm font-medium text-white">Gemini AI</div>
                            <div className="text-xs text-[#666666]">Hints</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-sm">
                        <a
                            href="mailto:contact@example.com"
                            className="flex items-center gap-2 text-[#888888] hover:text-[#ff7b00] transition-colors"
                        >
                            <Mail className="w-4 h-4" />
                            Contact
                        </a>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#888888] hover:text-[#ff7b00] transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            GitHub
                        </a>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
            >
                <div className="gamer-card p-8 sm:p-10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff3d3d]/10 to-[#ff7b00]/10" />

                    <div className="relative z-10">
                        <Star className="w-10 h-10 text-yellow-400 mx-auto mb-4" fill="currentColor" />
                        <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Ready to Play?</h2>
                        <p className="text-[#888888] mb-6 max-w-md mx-auto">
                            Join the community and start building your vocabulary today!
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link href="/game">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00] text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/20"
                                >
                                    <Gamepad2 className="w-5 h-5" />
                                    Start Playing
                                    <ChevronRight className="w-4 h-4" />
                                </motion.button>
                            </Link>

                            <Link href="/how-to-play">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-[#2a2a2a] text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 border border-[#3a3a3a]"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    Learn How
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Footer Note */}
            <div className="text-center mt-8 text-xs text-[#555555]">
                <p>© 2025 WordChainPro • EST 415 Project • FUTA</p>
                <p className="mt-1">Made with 💜 and lots of ☕</p>
            </div>
        </div>
    );
}
