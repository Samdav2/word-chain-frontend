'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Flame, Star, CheckCircle } from 'lucide-react';

interface MissionCardProps {
    title: string;
    description: string;
    progress: number;
    maxProgress: number;
    reward: {
        type: 'xp' | 'coins' | 'stars';
        amount: number;
    };
    completed?: boolean;
}

export default function MissionCard({
    title,
    description,
    progress,
    maxProgress,
    reward,
    completed = false
}: MissionCardProps) {
    const percentage = Math.min((progress / maxProgress) * 100, 100);

    const RewardIcon = {
        xp: Flame,
        coins: Coins,
        stars: Star
    }[reward.type];

    const rewardColors = {
        xp: 'text-[#ff7b00]',
        coins: 'text-yellow-400',
        stars: 'text-purple-400'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.01 }}
            className={`gamer-card ${completed ? 'border-green-500/50' : ''}`}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        {completed && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        <h4 className="font-bold text-white">{title}</h4>
                    </div>
                    <p className="text-sm text-[#888888] mb-3">{description}</p>

                    {/* Progress */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="text-[#666666]">Progress</span>
                            <span className="text-white font-medium">{progress}/{maxProgress}</span>
                        </div>
                        <div className="mission-progress">
                            <motion.div
                                className="mission-progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </div>

                {/* Reward */}
                <div className="flex flex-col items-center gap-1 px-3 py-2 bg-[#0a0a0a] rounded-lg">
                    <RewardIcon className={`w-5 h-5 ${rewardColors[reward.type]}`} />
                    <span className={`text-sm font-bold ${rewardColors[reward.type]}`}>
                        +{reward.amount}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
