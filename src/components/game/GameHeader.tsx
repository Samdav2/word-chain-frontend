'use client';

import React from 'react';
import { Flame, Coins, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface GameHeaderProps {
    level?: number;
    levelName?: string;
    points?: number;
    streak?: number;
    progress?: number;
}

export default function GameHeader({
    level = 5,
    levelName = 'Word Wizard',
    points = 1250,
    streak = 7,
    progress = 60
}: GameHeaderProps) {
    return (
        <header className="bg-[var(--game-header-bg)] text-white py-3 px-4 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
                {/* Left: Back Button & Logo */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">
                            W
                        </div>
                        <div>
                            <span className="font-bold text-cyan-300">WordLink</span>
                            <span className="text-xs text-cyan-100 block -mt-0.5">Academy</span>
                        </div>
                    </div>
                </div>

                {/* Center: Level & Progress */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center border-2 border-amber-300">
                        <span className="text-xl">🎓</span>
                    </div>
                    <div>
                        <div className="text-sm font-semibold">Level {level}: {levelName}</div>
                        <div className="w-32 h-2 bg-white/20 rounded-full mt-1 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Points & Streak */}
                <div className="flex items-center gap-4">
                    {/* Points */}
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="font-bold text-yellow-300">{points.toLocaleString()} Points</span>
                    </div>

                    {/* Streak */}
                    <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1.5 rounded-full">
                        <Flame className="w-4 h-4 text-yellow-300" />
                        <span className="font-bold">{streak} Day Streak</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
