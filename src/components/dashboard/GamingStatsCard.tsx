'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface GamingStatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
    variant?: 'red' | 'orange' | 'white';
}

export default function GamingStatsCard({
    title,
    value,
    icon,
    trend,
    trendUp = true,
    variant = 'red'
}: GamingStatsCardProps) {
    const variantClasses = {
        red: 'gamer-stat-red',
        orange: 'gamer-stat-orange',
        white: 'gamer-stat-white'
    };

    const iconColors = {
        red: 'text-[#ff3d3d]',
        orange: 'text-[#ff7b00]',
        white: 'text-white'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`gamer-card ${variantClasses[variant]}`}
        >
            {/* Top Glow Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--stat-color)] to-transparent opacity-60" />

            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-[#888888] uppercase tracking-wider">
                        {title}
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
                        {value}
                    </h3>
                </div>
                <div className={`p-3 rounded-lg bg-[#0a0a0a] ${iconColors[variant]}`}>
                    {icon}
                </div>
            </div>

            {trend && (
                <div className="flex items-center gap-2 mt-4">
                    {trendUp ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-xs font-medium ${trendUp ? 'text-green-500' : 'text-red-400'}`}>
                        {trend}
                    </span>
                </div>
            )}

            {/* Bottom Accent Glow */}
            <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[var(--stat-color)] to-transparent opacity-30" />
        </motion.div>
    );
}
