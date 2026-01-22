'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Twitter, Github, MessageCircle, ArrowRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-[#2a2a2a] bg-[#050505] pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00] flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-black text-white">WordChain<span className="text-[#ff7b00]">Pro</span></span>
                        </div>
                        <p className="text-[#888888] text-sm leading-relaxed">
                            The ultimate word association game powered by the SAM learning model. Master vocabulary through play.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            {[
                                { name: 'twitter', icon: Twitter },
                                { name: 'github', icon: Github },
                                { name: 'discord', icon: MessageCircle }
                            ].map((social) => (
                                <a key={social.name} href="#" className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#888888] hover:bg-[#ff7b00] hover:text-white transition-all hover:-translate-y-1">
                                    <span className="sr-only">{social.name}</span>
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="font-bold text-white mb-6">Product</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/game" className="text-[#888888] hover:text-[#ff7b00] transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7b00] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Play Game
                                </Link>
                            </li>
                            <li>
                                <Link href="/sam-model" className="text-[#888888] hover:text-[#ff7b00] transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7b00] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    SAM Model
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#ff7b00]/10 text-[#ff7b00]">NEW</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/leaderboard" className="text-[#888888] hover:text-[#ff7b00] transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7b00] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Leaderboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-bold text-white mb-6">Resources</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/how-to-play" className="text-[#888888] hover:text-[#ff7b00] transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7b00] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    How to Play
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-[#888888] hover:text-[#ff7b00] transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7b00] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-bold text-white mb-6">Stay Updated</h3>
                        <p className="text-[#888888] text-sm mb-4">
                            Get the latest updates on new features and challenges.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-[#1a1a1a] border border-[#333333] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#ff7b00] w-full"
                            />
                            <button className="p-2 rounded-lg bg-[#ff7b00] text-white hover:bg-[#ff8c1a] transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#2a2a2a] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[#666666] text-sm">
                        © 2025 WordChainPro. Built for learning.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-[#666666]">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
