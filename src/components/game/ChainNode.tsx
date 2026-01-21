'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/components/common/ui';

interface ChainNodeProps {
    word: string;
    index: number;
    isLast: boolean;
}

export default function ChainNode({ word, index, isLast }: ChainNodeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex flex-col items-center"
        >
            <div
                className={cn(
                    "relative flex items-center justify-center w-32 h-12 rounded-lg font-bold text-lg shadow-md transition-all",
                    isLast
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20 z-10 scale-110"
                        : "bg-card text-card-foreground border border-border opacity-80"
                )}
            >
                {word}

                {/* Connector Line */}
                {!isLast && (
                    <div className="absolute top-full left-1/2 w-0.5 h-8 bg-border -translate-x-1/2" />
                )}
            </div>

            {/* Spacer for the connector */}
            {!isLast && <div className="h-8" />}
        </motion.div>
    );
}
