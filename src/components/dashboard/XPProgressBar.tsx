'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Star } from 'lucide-react';

interface XPProgressBarProps {
    currentXP: number;
    maxXP: number;
    level: number;
    showLabel?: boolean;
}

export default function XPProgressBar({
    currentXP,
    maxXP,
    level,
    showLabel = true
}: XPProgressBarProps) {
    const percentage = Math.min((currentXP / maxXP) * 100, 100);

    return (
        <div className="space-y-2">
            {showLabel && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="level-badge">
                            <Star className="w-3 h-3" />
                            <span>LVL {level}</span>
                        </div>
                        <span className="text-[#888888] text-sm">
                            {currentXP.toLocaleString()} / {maxXP.toLocaleString()} XP
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 fire-icon" />
                        <span className="text-[#ff7b00] font-bold text-sm">{Math.round(percentage)}%</span>
                    </div>
                </div>
            )}

            <div className="xp-bar-container">
                <motion.div
                    className="xp-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />

                {/* XP Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white drop-shadow-lg">
                        {Math.round(maxXP - currentXP)} XP to Level {level + 1}
                    </span>
                </div>
            </div>
        </div>
    );
}
