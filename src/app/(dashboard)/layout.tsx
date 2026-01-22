'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, LayoutDashboard, BarChart3, Trophy, Gamepad2, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const navLinks = [
        { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
        { href: '/game', label: 'Play', icon: Gamepad2 },
        { href: '/analytics', label: 'Stats', icon: BarChart3 },
        { href: '/leaderboard', label: 'Ranks', icon: Trophy },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <div className="min-h-screen bg-[#0a0a0a] pb-20">
            {/* Minimal Header - Logo & User Only */}
            <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#2a2a2a]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-14 sm:h-16 items-center">
                        {/* Logo */}
                        <Link href="/dashboard" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00] flex items-center justify-center transition-transform group-hover:scale-110">
                                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <span className="text-base sm:text-lg font-black text-white">
                                WordChain<span className="text-[#ff7b00]">Pro</span>
                            </span>
                        </Link>

                        {/* User Section */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* User Avatar */}
                            <Link href="/profile" className="flex items-center gap-2">
                                <div className="relative">
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#ff3d3d] to-[#ff7b00] p-0.5">
                                        <div className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center text-xs sm:text-sm font-bold text-white">
                                            {(user?.first_name || user?.display_name || 'U').charAt(0)}
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
                                </div>
                                <span className="text-sm font-medium text-white hidden sm:block max-w-[100px] truncate">
                                    {user?.first_name || user?.display_name || 'Player'}
                                </span>
                            </Link>

                            {/* Logout Button */}
                            <button
                                onClick={logout}
                                className="p-1.5 sm:p-2 rounded-lg text-[#888888] hover:text-[#ff3d3d] hover:bg-[#1a1a1a] transition-all duration-200"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {children}
            </main>

            {/* Bottom Navigation Bar - App Style */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-[#2a2a2a] safe-area-bottom">
                <div className="max-w-lg mx-auto px-2">
                    <div className="flex items-center justify-around h-16">
                        {navLinks.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className="flex-1 flex flex-col items-center justify-center gap-1 py-2 group"
                            >
                                <div className={`relative p-2 rounded-xl transition-all duration-200 ${isActive(href)
                                    ? 'bg-gradient-to-r from-[#ff3d3d]/20 to-[#ff7b00]/20'
                                    : 'group-hover:bg-[#1a1a1a]'
                                    }`}>
                                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${isActive(href)
                                        ? 'text-[#ff7b00]'
                                        : 'text-[#666666] group-hover:text-white'
                                        }`} />
                                    {isActive(href) && (
                                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff7b00] rounded-full" />
                                    )}
                                </div>
                                <span className={`text-[10px] sm:text-xs font-medium transition-colors ${isActive(href)
                                    ? 'text-[#ff7b00]'
                                    : 'text-[#666666] group-hover:text-white'
                                    }`}>
                                    {label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </div>
    );
}
