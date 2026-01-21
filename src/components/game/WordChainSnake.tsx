'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WordChainSnakeProps {
    words: string[];
    maxVisible?: number;
}

export default function WordChainSnake({ words, maxVisible = 5 }: WordChainSnakeProps) {
    // Get the last N words to display
    const visibleWords = words.slice(-maxVisible);

    // Calculate how many words we need for the pattern
    const displayWords = [...visibleWords];

    // Add empty slot for next word
    const showEmptySlot = true;

    const getNodeColor = (index: number) => {
        // Alternate colors: orange, teal
        return index % 2 === 0 ? 'chain-node-orange' : 'chain-node-teal';
    };

    // Create snake pattern layout
    // Row 0: word 0 -> word 1 (left to right)
    // Row 1: word 2 <- word 1 (right to left - continue from word 1)
    // Row 2: word 3 -> word 4 (left to right - continue from word 2)

    const rows: { words: Array<{ word: string; colorIndex: number; isEmpty?: boolean }>; direction: 'ltr' | 'rtl' }[] = [];

    let currentIndex = 0;
    const allItems = [...displayWords.map((w, i) => ({ word: w, colorIndex: i, isEmpty: false }))];
    if (showEmptySlot) {
        allItems.push({ word: '', colorIndex: displayWords.length, isEmpty: true });
    }

    // First row: 2 items (left to right)
    if (allItems.length > 0) {
        rows.push({ words: allItems.slice(0, 2), direction: 'ltr' });
        currentIndex = 2;
    }

    // Second row: 1 item (appears on the right, chain comes from above)
    if (allItems.length > 2) {
        rows.push({ words: allItems.slice(2, 3), direction: 'rtl' });
        currentIndex = 3;
    }

    // Third row: remaining items
    if (allItems.length > 3) {
        rows.push({ words: allItems.slice(3), direction: 'ltr' });
    }

    return (
        <div className="flex flex-col items-center gap-2 py-6">
            {rows.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className={`flex items-center gap-2 ${row.direction === 'rtl' ? 'justify-end' : 'justify-start'}`}
                    style={{ minWidth: '380px' }}
                >
                    {row.words.map((item, itemIndex) => {
                        const isFirst = rowIndex === 0 && itemIndex === 0;
                        const actualIndex = rows.slice(0, rowIndex).reduce((acc, r) => acc + r.words.length, 0) + itemIndex;
                        const showArrow = actualIndex < allItems.length - 1;

                        return (
                            <React.Fragment key={`${item.word}-${actualIndex}`}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: actualIndex * 0.1 }}
                                    className={`
                                        relative flex items-center justify-center
                                        px-6 py-3 rounded-full font-bold text-lg
                                        shadow-md min-w-[100px]
                                        ${item.isEmpty ? 'chain-node-empty' : getNodeColor(item.colorIndex)}
                                    `}
                                >
                                    {item.isEmpty ? (
                                        <span className="text-2xl">|</span>
                                    ) : (
                                        item.word
                                    )}
                                </motion.div>

                                {/* Arrow connector within same row */}
                                {showArrow && itemIndex < row.words.length - 1 && (
                                    <div className="flex items-center text-[#7eb8c5]">
                                        <svg width="40" height="20" viewBox="0 0 40 20">
                                            <path
                                                d="M0 10 L30 10"
                                                stroke="#7eb8c5"
                                                strokeWidth="3"
                                                fill="none"
                                            />
                                            <polygon
                                                points="28,5 38,10 28,15"
                                                fill="#7eb8c5"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}

                    {/* Curved connector to next row */}
                    {rowIndex < rows.length - 1 && row.words.length > 0 && (
                        <div className="absolute hidden">
                            {/* This would be the curved connector - simplified for now */}
                        </div>
                    )}
                </div>
            ))}

            {/* SVG Curved connectors between rows */}
            <svg
                className="absolute pointer-events-none"
                style={{
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    overflow: 'visible'
                }}
            >
                {/* Connectors would go here - keeping it simple for now */}
            </svg>
        </div>
    );
}
