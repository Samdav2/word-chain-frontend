'use client';

import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-[#2a2a2a]">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00] flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <span className="text-base sm:text-xl font-black text-white">
                        WordChain<span className="text-[#ff7b00]">Pro</span>
                    </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-4">
                    <Link
                        href="/login"
                        className="text-[#ff7b00] hover:text-[#ff9500] transition-colors font-medium text-xs sm:text-base px-1.5 sm:px-3"
                    >
                        Login
                    </Link>
                    <Link href="/signup">
                        <button
                            className="bg-gradient-to-r from-[#ff3d3d] to-[#ff7b00] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-[10px] sm:text-sm py-1.5 sm:py-2.5 px-2.5 sm:px-5 whitespace-nowrap"
                        >
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
