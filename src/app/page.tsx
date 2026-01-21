'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Play, Trophy, Target, Zap, Brain,
  ChevronRight, Flame, Star, Users, Award
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="gamistic-theme gamistic-container min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00] flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-white">WordChain<span className="text-[#ff7b00]">Pro</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-white hover:text-[#ff7b00] transition-colors font-medium">
              Login
            </Link>
            <Link href="/signup">
              <button className="gamer-btn-primary text-sm py-2 px-4">
                Sign Up Free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#ff3d3d]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#ff7b00]/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#ff7b00]/30 rounded-full px-4 py-2 mb-6">
                <Flame className="w-4 h-4 text-[#ff7b00]" />
                <span className="text-sm text-[#ff7b00]">Level Up Your Vocabulary</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
                Master Words Through
                <span className="block glow-text-red">Epic Chains</span>
              </h1>

              <p className="text-xl text-[#888888] max-w-2xl mx-auto mb-10">
                Transform words one letter at a time in this addictive educational game.
                Build chains, earn XP, and climb the leaderboard!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="gamer-btn-primary pulse-glow flex items-center gap-3 text-lg px-8 py-4"
                  >
                    <Play className="w-6 h-6" fill="white" />
                    START PLAYING FREE
                  </motion.button>
                </Link>
                <Link href="/login" className="text-white hover:text-[#ff7b00] transition-colors flex items-center gap-2">
                  Already have an account? <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Game Preview */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 gamer-card p-8"
            >
              <div className="text-center mb-6">
                <span className="text-sm text-[#888888]">Example Challenge</span>
                <h3 className="text-xl font-bold text-white">Transform FAIL → PASS</h3>
              </div>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {['FAIL', 'FALL', 'PALL', 'PALS', 'PASS'].map((word, index) => (
                  <React.Fragment key={word}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`px-6 py-3 rounded-full font-bold text-lg ${index === 0 ? 'bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00] text-white' :
                          index === 4 ? 'bg-green-500 text-white' :
                            'bg-[#2a2a2a] text-white border border-[#3a3a3a]'
                        }`}
                    >
                      {word}
                    </motion.div>
                    {index < 4 && (
                      <ChevronRight className="w-5 h-5 text-[#888888]" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="text-center text-[#888888] mt-6">
                +10 XP per valid move • +50 XP bonus for completion
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Why Players Love It</h2>
            <p className="text-[#888888]">Built for learning, designed for engagement</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'AI-Powered Hints',
                description: 'Get smart hints using BFS pathfinding when you\'re stuck',
                color: 'orange'
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Daily Missions',
                description: 'Complete challenges to earn bonus XP and rewards',
                color: 'red'
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: 'Leaderboards',
                description: 'Compete with other students and climb the ranks',
                color: 'orange'
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: 'XP Progression',
                description: 'Level up and unlock achievements as you play',
                color: 'red'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'SAM Analytics',
                description: 'Track your learning progress with detailed insights',
                color: 'orange'
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Achievements',
                description: 'Unlock badges and show off your word mastery',
                color: 'red'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="gamer-card hover:scale-105 transition-transform"
              >
                <div className={`p-3 rounded-lg w-fit mb-4 ${feature.color === 'red'
                    ? 'bg-[#ff3d3d]/10 text-[#ff3d3d]'
                    : 'bg-[#ff7b00]/10 text-[#ff7b00]'
                  }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-[#888888]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="gamer-card p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00]" />

            <h2 className="text-4xl font-black text-white mb-4">
              Ready to Build Your First Chain?
            </h2>
            <p className="text-[#888888] mb-8 max-w-xl mx-auto">
              Join thousands of students improving their vocabulary through play.
              It's free to start!
            </p>
            <Link href="/signup">
              <button className="gamer-btn-primary pulse-glow flex items-center gap-3 mx-auto text-lg px-8 py-4">
                <Zap className="w-6 h-6" />
                CREATE FREE ACCOUNT
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#ff7b00]" />
            <span className="font-bold text-white">WordChain<span className="text-[#ff7b00]">Pro</span></span>
          </div>
          <p className="text-[#888888] text-sm">
            © 2026 EdTech Word Chain Game. Built for learning.
          </p>
        </div>
      </footer>
    </div>
  );
}
