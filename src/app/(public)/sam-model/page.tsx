'use client';

import { motion } from 'framer-motion';
import {
    Brain, Target, PenTool, Code2, RefreshCw,
    ArrowRight, CheckCircle2, Lightbulb, Layers,
    Rocket, Users, BarChart3
} from 'lucide-react';

export default function SamModelPage() {
    const phases = [
        {
            id: 'evaluation',
            title: 'Evaluation',
            icon: <Target className="w-8 h-8 text-[#ff3d3d]" />,
            color: '#ff3d3d',
            description: 'Analyzing performance and identifying learning gaps.',
            details: [
                'Real-time error analysis',
                'Performance metrics tracking',
                'Knowledge gap identification',
                'Difficulty adjustment'
            ]
        },
        {
            id: 'design',
            title: 'Design',
            icon: <PenTool className="w-8 h-8 text-[#ff7b00]" />,
            color: '#ff7b00',
            description: 'Creating targeted challenges based on evaluation data.',
            details: [
                'Adaptive word selection',
                'Category-specific challenges',
                'Hint generation logic',
                'Progression pathing'
            ]
        },
        {
            id: 'development',
            title: 'Development',
            icon: <Code2 className="w-8 h-8 text-[#22c55e]" />,
            color: '#22c55e',
            description: 'Implementing the learning experience and feedback.',
            details: [
                'Interactive game mechanics',
                'Instant feedback systems',
                'Visual progress indicators',
                'Reward distribution'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] pb-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-b border-[#222222]">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff3d3d]/10 to-[#ff7b00]/10 opacity-30" />

                <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#333333] mb-6"
                    >
                        <Brain className="w-4 h-4 text-[#ff7b00]" />
                        <span className="text-sm font-medium text-[#888888]">Instructional Design Model</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
                    >
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00]">SAM</span> Model
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-[#888888] max-w-2xl mx-auto leading-relaxed"
                    >
                        Successive Approximation Model: An agile approach to creating effective learning experiences through iterative design and development.
                    </motion.p>
                </div>
            </div>

            {/* The Cycle Diagram */}
            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Interactive Diagram */}
                    <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="w-[80%] h-[80%] rounded-full border border-dashed border-[#333333]"
                            />
                        </div>

                        {/* Central Hub */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-[#1a1a1a] border border-[#333333] flex items-center justify-center z-10 shadow-2xl shadow-orange-500/10">
                                <RefreshCw className="w-10 h-10 text-[#ff7b00]" />
                            </div>
                        </div>

                        {/* Phase Nodes */}
                        {phases.map((phase, index) => {
                            const angle = (index * 360) / phases.length - 90;
                            const radius = 40; // percentage
                            const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                            const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

                            return (
                                <motion.div
                                    key={phase.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="absolute w-20 h-20 -ml-10 -mt-10 rounded-2xl bg-[#1a1a1a] border border-[#333333] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer group z-20"
                                    style={{ left: `${x}%`, top: `${y}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl"
                                        style={{ backgroundImage: `linear-gradient(to bottom right, ${phase.color}, transparent)` }}
                                    />
                                    {phase.icon}

                                    {/* Connecting Lines */}
                                    <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none -z-10 opacity-20">
                                        <line
                                            x1="50%" y1="50%"
                                            x2={`${50 + (50 - x) * 1.5}%`}
                                            y2={`${50 + (50 - y) * 1.5}%`}
                                            stroke={phase.color}
                                            strokeWidth="2"
                                            strokeDasharray="4 4"
                                        />
                                    </svg>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Phase Details */}
                    <div className="space-y-8">
                        {phases.map((phase, index) => (
                            <motion.div
                                key={phase.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="gamer-card group hover:border-[#333333] transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl bg-[#1a1a1a] group-hover:bg-[${phase.color}]/10 transition-colors`}>
                                        {phase.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                            {phase.title}
                                            <ArrowRight className="w-4 h-4 text-[#666666] group-hover:translate-x-1 transition-transform" />
                                        </h3>
                                        <p className="text-[#888888] mb-4">{phase.description}</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {phase.details.map((detail, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-[#666666]">
                                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: phase.color }} />
                                                    {detail}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Implementation Section */}
            <div className="bg-[#0f0f0f] border-y border-[#222222]">
                <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">How We Use SAM</h2>
                        <p className="text-[#888888] max-w-2xl mx-auto">
                            WordChainPro implements the SAM model directly into the gameplay loop to ensure continuous learning and improvement.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="gamer-card text-center">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                                <BarChart3 className="w-8 h-8 text-[#ff3d3d]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Adaptive Difficulty</h3>
                            <p className="text-sm text-[#888888]">
                                The game constantly evaluates your performance (Evaluation) to adjust word complexity and hint availability in real-time.
                            </p>
                        </div>
                        <div className="gamer-card text-center">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                                <Layers className="w-8 h-8 text-[#ff7b00]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Iterative Learning</h3>
                            <p className="text-sm text-[#888888]">
                                Challenges are designed (Design) to revisit weak areas, reinforcing vocabulary through spaced repetition and varied contexts.
                            </p>
                        </div>
                        <div className="gamer-card text-center">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                                <Rocket className="w-8 h-8 text-[#22c55e]" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Instant Feedback</h3>
                            <p className="text-sm text-[#888888]">
                                Immediate validation and explanations (Development) help you understand mistakes instantly, closing the learning loop.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h2 className="text-3xl font-bold text-white mb-6">Experience SAM in Action</h2>
                <p className="text-[#888888] mb-8">
                    Start playing now to see how the model adapts to your learning style.
                </p>
                <motion.a
                    href="/game"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00] text-white font-bold shadow-lg shadow-orange-500/20"
                >
                    <Rocket className="w-5 h-5" />
                    Start Learning
                </motion.a>
            </div>
        </div>
    );
}
