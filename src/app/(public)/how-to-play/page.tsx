'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    BookOpen, Gamepad2, Target, Zap, Brain, Trophy,
    ChevronRight, ChevronLeft, Star, Flame, Gift,
    Lightbulb, Timer, ArrowRight, Sparkles, Award,
    Play, Home, TrendingUp, Crown, Medal, Check
} from 'lucide-react';

// Tutorial steps
const tutorialSteps = [
    {
        title: "Start with a Word",
        description: "You'll be given a starting word and a target word. Your mission is to create a chain of words connecting them!",
        example: { start: "CAT", target: "DOG", chain: ["CAT", "COT", "COG", "DOG"] },
        tip: "Each word in your chain must differ by exactly one letter from the previous word."
    },
    {
        title: "Change One Letter",
        description: "To move from one word to another, you can only change a single letter. The word must be valid!",
        example: { start: "CAT", target: "CAR", change: { from: "T", to: "R", position: 2 } },
        tip: "Think about which letter gives you the most options for the next move."
    },
    {
        title: "Reach the Target",
        description: "Keep chaining words until you reach your target word. The fewer moves, the more XP you earn!",
        example: { moves: 4, xp: 150, bonus: "+50 XP for under 5 moves!" },
        tip: "Speed matters too! Complete faster for bonus XP."
    },
    {
        title: "Use AI Hints",
        description: "Stuck? Use the AI hint feature to get suggestions. Each game gives you limited hints based on difficulty.",
        hint: { word: "COT", explanation: "Change 'A' to 'O' to get closer to words ending in 'G'" },
        tip: "Save hints for the tricky parts - they're limited!"
    }
];

// Game features
const features = [
    {
        icon: Target,
        title: "Multiple Difficulties",
        description: "Easy (6+ hints), Medium (3 hints), or Hard (1 hint). Higher difficulty = more XP!",
        color: "text-green-400"
    },
    {
        icon: BookOpen,
        title: "Word Categories",
        description: "Animals, Technology, Science, Sports, and more! Each category has unique word sets.",
        color: "text-blue-400"
    },
    {
        icon: Brain,
        title: "AI-Powered Hints",
        description: "Get intelligent word suggestions when stuck. The AI explains its reasoning!",
        color: "text-purple-400"
    },
    {
        icon: Timer,
        title: "Timed Challenges",
        description: "Beat the clock for bonus XP. Faster completion = bigger rewards!",
        color: "text-yellow-400"
    },
    {
        icon: Trophy,
        title: "Leaderboards",
        description: "Compete globally! Climb the ranks from Bronze to Diamond tier.",
        color: "text-orange-400"
    },
    {
        icon: Gift,
        title: "Daily Missions",
        description: "Complete daily challenges for bonus XP, coins, and special rewards!",
        color: "text-pink-400"
    }
];

// Tier progression
const tiers = [
    { name: "Bronze", emoji: "🥉", xp: "0 - 499", color: "text-amber-600" },
    { name: "Silver", emoji: "🥈", xp: "500 - 1,499", color: "text-gray-300" },
    { name: "Gold", emoji: "🥇", xp: "1,500 - 3,499", color: "text-yellow-400" },
    { name: "Platinum", emoji: "💎", xp: "3,500 - 7,499", color: "text-cyan-400" },
    { name: "Diamond", emoji: "👑", xp: "7,500+", color: "text-purple-400" },
];

// Tips
const proTips = [
    "Think backwards! Sometimes working from the target word helps find shorter chains.",
    "Common letters (E, A, T, S, R) give you more word options.",
    "Practice with Easy mode to build your vocabulary database.",
    "The timer starts when you make your first move, not when the game starts.",
    "Win streaks multiply your XP! Keep that streak alive!",
    "Daily missions stack - complete them all for maximum rewards."
];

export default function HowToPlayPage() {
    const [activeStep, setActiveStep] = useState(0);
    const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

    return (
        <div className="min-h-screen pb-12 px-4 sm:px-6">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#2a2a2a] p-6 sm:p-10 mb-8"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff7b00]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ff3d3d]/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00] flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-black text-white">How to Play</h1>
                            <p className="text-[#888888] text-sm">Master Word Chain Pro</p>
                        </div>
                    </div>

                    <p className="text-[#aaaaaa] max-w-xl mb-6">
                        Word Chain Pro is a vocabulary game where you connect words by changing one letter at a time.
                        Build chains, earn XP, and climb the leaderboards!
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <Link href="/game">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00] text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2"
                            >
                                <Play className="w-5 h-5" fill="white" />
                                Start Playing
                            </motion.button>
                        </Link>
                        <Link href="/dashboard">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-[#2a2a2a] text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 border border-[#3a3a3a]"
                            >
                                <Home className="w-5 h-5" />
                                Dashboard
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Step-by-Step Tutorial */}
            <section className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Gamepad2 className="w-6 h-6 text-[#ff7b00]" />
                    Step-by-Step Guide
                </h2>

                <div className="gamer-card p-4 sm:p-6">
                    {/* Step Navigation */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                            disabled={activeStep === 0}
                            className="p-2 rounded-lg bg-[#2a2a2a] text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex gap-2">
                            {tutorialSteps.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveStep(i)}
                                    className={`w-3 h-3 rounded-full transition-all ${activeStep === i
                                        ? 'bg-[#ff7b00] w-8'
                                        : 'bg-[#3a3a3a] hover:bg-[#4a4a4a]'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => setActiveStep(Math.min(tutorialSteps.length - 1, activeStep + 1))}
                            disabled={activeStep === tutorialSteps.length - 1}
                            className="p-2 rounded-lg bg-[#2a2a2a] text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00] flex items-center justify-center text-white font-bold">
                                    {activeStep + 1}
                                </span>
                                <h3 className="text-xl font-bold text-white">{tutorialSteps[activeStep].title}</h3>
                            </div>

                            <p className="text-[#aaaaaa]">{tutorialSteps[activeStep].description}</p>

                            {/* Example visualization */}
                            {tutorialSteps[activeStep].example?.chain && (() => {
                                const chain = tutorialSteps[activeStep].example!.chain!;
                                return (
                                    <div className="bg-[#0a0a0a] rounded-xl p-4 border border-[#2a2a2a]">
                                        <p className="text-xs text-[#666666] mb-3">Example Chain:</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {chain.map((word, i) => (
                                                <React.Fragment key={word}>
                                                    <span className={`px-3 py-2 rounded-lg font-mono text-sm font-bold ${i === 0 ? 'bg-green-500/20 text-green-400' :
                                                        i === chain.length - 1 ? 'bg-[#ff7b00]/20 text-[#ff7b00]' :
                                                            'bg-[#2a2a2a] text-white'
                                                        }`}>
                                                        {word}
                                                    </span>
                                                    {i < chain.length - 1 && (
                                                        <ArrowRight className="w-4 h-4 text-[#666666]" />
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Tip */}
                            <div className="flex items-start gap-3 bg-[#ff7b00]/10 border border-[#ff7b00]/30 rounded-xl p-4">
                                <Lightbulb className="w-5 h-5 text-[#ff7b00] flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-[#ff7b00]">{tutorialSteps[activeStep].tip}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* Features Grid */}
            <section className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#ff7b00]" />
                    Game Features
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="gamer-card p-4 hover:border-[#ff7b00]/30 transition-colors cursor-pointer"
                            onClick={() => setExpandedFeature(expandedFeature === index ? null : index)}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center ${feature.color}`}>
                                    <feature.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                                    <p className="text-sm text-[#888888]">{feature.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Tier System */}
            <section className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-[#ff7b00]" />
                    Tier & XP System
                </h2>

                <div className="gamer-card p-4 sm:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {tiers.map((tier, index) => (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-4 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]"
                            >
                                <span className="text-3xl mb-2 block">{tier.emoji}</span>
                                <h4 className={`font-bold ${tier.color}`}>{tier.name}</h4>
                                <p className="text-xs text-[#666666] mt-1">{tier.xp} XP</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-6 bg-[#0a0a0a] rounded-xl p-4 border border-[#2a2a2a]">
                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                            <Award className="w-4 h-4 text-[#ff7b00]" />
                            How to Earn XP
                        </h4>
                        <ul className="space-y-2 text-sm text-[#888888]">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Complete games - 50-200 XP based on difficulty</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Win bonus - Extra XP for reaching target word</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Speed bonus - Complete quickly for extra XP</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Efficiency bonus - Fewer moves = more XP</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Win streaks - Multiplier for consecutive wins</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Daily missions - Bonus XP for completing challenges</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Pro Tips */}
            <section className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Crown className="w-6 h-6 text-[#ff7b00]" />
                    Pro Tips
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {proTips.map((tip, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 bg-[#1a1a1a] rounded-xl p-4 border border-[#2a2a2a]"
                        >
                            <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" />
                            <p className="text-sm text-[#aaaaaa]">{tip}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="gamer-card p-6 sm:p-8 text-center"
            >
                <h2 className="text-2xl font-bold text-white mb-2">Ready to Start?</h2>
                <p className="text-[#888888] mb-6">Put your vocabulary skills to the test!</p>

                <Link href="/game">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00] text-white font-bold py-4 px-8 rounded-xl flex items-center gap-3 mx-auto text-lg shadow-lg shadow-orange-500/20"
                    >
                        <Gamepad2 className="w-6 h-6" />
                        Play Now
                        <ChevronRight className="w-5 h-5" />
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
}
