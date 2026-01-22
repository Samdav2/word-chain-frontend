'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Home, Gamepad2, RefreshCw, Compass, Sparkles, AlertTriangle } from 'lucide-react';

// Funny word suggestions for "fixing" the broken URL
const wordSuggestions = [
    { word: "404", suggestion: "four-oh-four", meaning: "Ancient code for 'Oops, we goofed!'" },
    { word: "lost", suggestion: "found", meaning: "The opposite of where you are right now" },
    { word: "page", suggestion: "parchment", meaning: "Like paper, but fancier" },
    { word: "error", suggestion: "opportunity", meaning: "Every bug is a feature in disguise!" },
];

// Animated chain link component
const ChainLink = ({ delay, broken }: { delay: number; broken?: boolean }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, type: "spring" }}
        className={`relative ${broken ? 'opacity-50' : ''}`}
    >
        <div className={`w-12 h-16 sm:w-16 sm:h-20 rounded-full border-4 ${broken ? 'border-red-500/50 border-dashed' : 'border-[#ff7b00]'
            } flex items-center justify-center`}>
            {broken ? (
                <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="text-xl sm:text-2xl"
                >
                    💥
                </motion.span>
            ) : (
                <span className="text-xl sm:text-2xl">🔗</span>
            )}
        </div>
    </motion.div>
);

export default function NotFound() {
    const [currentSuggestion, setCurrentSuggestion] = useState(0);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSuggestion((prev) => (prev + 1) % wordSuggestions.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setShowHint(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#ff3d3d]/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#ff7b00]/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-2xl w-full text-center">
                {/* Broken Chain Animation */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-1 sm:gap-2 mb-6 sm:mb-8"
                >
                    <ChainLink delay={0.1} />
                    <ChainLink delay={0.2} />
                    <ChainLink delay={0.3} broken />
                    <ChainLink delay={0.4} />
                    <ChainLink delay={0.5} />
                </motion.div>

                {/* Main 404 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                >
                    <h1 className="text-7xl sm:text-9xl font-black mb-2">
                        <span className="bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00] bg-clip-text text-transparent">
                            4
                        </span>
                        <motion.span
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="inline-block text-gray-700"
                        >
                            🔗
                        </motion.span>
                        <span className="bg-gradient-to-r from-[#ff7b00] to-[#ff3d3d] bg-clip-text text-transparent">
                            4
                        </span>
                    </h1>
                </motion.div>

                {/* Fun Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-4 mb-8"
                >
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                        Your Word Chain Broke! 🔗💥
                    </h2>
                    <p className="text-[#888888] text-sm sm:text-base max-w-md mx-auto">
                        Looks like this page is missing from our dictionary...
                        <br />
                        The chain doesn't connect here!
                    </p>
                </motion.div>

                {/* Word Suggestion Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 border border-[#2a2a2a] mb-8 mx-auto max-w-md"
                >
                    <div className="flex items-center gap-2 text-[#888888] text-sm mb-4">
                        <Sparkles className="w-4 h-4 text-[#ff7b00]" />
                        <span>AI Word Suggestion</span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSuggestion}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="text-left"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-white font-mono bg-[#2a2a2a] px-3 py-1 rounded line-through">
                                    {wordSuggestions[currentSuggestion].word}
                                </span>
                                <span className="text-[#888888]">→</span>
                                <span className="text-[#ff7b00] font-bold">
                                    {wordSuggestions[currentSuggestion].suggestion}
                                </span>
                            </div>
                            <p className="text-xs text-[#666666] italic">
                                "{wordSuggestions[currentSuggestion].meaning}"
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
                >
                    <Link href="/dashboard">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00] text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/20"
                        >
                            <Home className="w-5 h-5" />
                            Back to Dashboard
                        </motion.button>
                    </Link>

                    <Link href="/game">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#1a1a1a] text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 border border-[#2a2a2a] hover:border-[#ff7b00] transition-colors"
                        >
                            <Gamepad2 className="w-5 h-5" />
                            Play a Game
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Hint */}
                <AnimatePresence>
                    {showHint && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-8 flex items-center justify-center gap-2 text-[#555555] text-sm"
                        >
                            <AlertTriangle className="w-4 h-4" />
                            <span>Pro tip: Check the URL - typos break chains too!</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Fun Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-12 flex items-center justify-center gap-6 text-[#444444] text-xs"
                >
                    <div className="text-center">
                        <div className="text-2xl mb-1">🎮</div>
                        <div>404 games</div>
                        <div>played today</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl mb-1">🔥</div>
                        <div>Not your</div>
                        <div>streak tho</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl mb-1">💎</div>
                        <div>0 XP from</div>
                        <div>this page</div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
