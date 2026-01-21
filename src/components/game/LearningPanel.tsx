'use client';

import React from 'react';
import { Volume2 } from 'lucide-react';

interface LearningPanelProps {
    word: string;
    definition?: string;
    funFact?: string;
    imageUrl?: string;
}

// Mock word data - in production this would come from an API
const wordData: Record<string, { definition: string; funFact: string; emoji: string }> = {
    'CAT': {
        definition: 'A small domesticated carnivorous mammal with soft fur.',
        funFact: 'Cats spend 70% of their lives sleeping!',
        emoji: '🐱'
    },
    'TIGER': {
        definition: 'A large wild cat with a yellow-brown coat striped with black.',
        funFact: 'No two tigers have the same stripes - they are like fingerprints!',
        emoji: '🐯'
    },
    'RABBIT': {
        definition: 'A small burrowing plant-eating mammal with long ears.',
        funFact: 'Rabbits can turn their ears 180 degrees!',
        emoji: '🐰'
    },
    'TURTLE': {
        definition: 'A slow-moving reptile with a bony shell.',
        funFact: 'Some turtles can live for over 100 years!',
        emoji: '🐢'
    },
    'START': {
        definition: 'The beginning point of an activity or process.',
        funFact: 'Every great journey starts with a single step!',
        emoji: '🚀'
    }
};

export default function LearningPanel({ word, definition, funFact, imageUrl }: LearningPanelProps) {
    const data = wordData[word.toUpperCase()] || {
        definition: definition || 'A word in the chain.',
        funFact: funFact || 'Keep building your word chain!',
        emoji: '📚'
    };

    const handleSpeak = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="game-panel h-full">
            <div className="game-panel-header">
                Learning Panel
            </div>
            <div className="p-4 space-y-4">
                {/* Last Played Word */}
                <div>
                    <p className="text-sm text-[var(--game-text-secondary)] mb-1">Last played word:</p>
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-[var(--game-text-primary)]">{word}</span>
                        <button
                            onClick={handleSpeak}
                            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                            title="Listen to pronunciation"
                        >
                            <Volume2 className="w-4 h-4 text-[var(--game-primary)]" />
                        </button>
                    </div>
                </div>

                {/* Word Image/Emoji */}
                <div className="flex justify-center py-4">
                    <div className="text-7xl">{data.emoji}</div>
                </div>

                {/* Definition */}
                <div>
                    <h4 className="font-semibold text-[var(--game-text-primary)] mb-1">Definition:</h4>
                    <p className="text-sm text-[var(--game-text-secondary)] leading-relaxed">
                        {data.definition}
                    </p>
                </div>

                {/* Fun Fact */}
                <div className="bg-[#fff8e1] rounded-lg p-3 border border-[#ffe082]">
                    <h4 className="font-semibold text-[#f57c00] mb-1 flex items-center gap-1">
                        <span>💡</span> Fun Fact:
                    </h4>
                    <p className="text-sm text-[#5d4037] leading-relaxed">
                        {data.funFact}
                    </p>
                </div>
            </div>
        </div>
    );
}
