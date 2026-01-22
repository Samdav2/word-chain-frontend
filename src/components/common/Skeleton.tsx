'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

// Base skeleton with pulse animation
export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-lg bg-[#2a2a2a]",
                className
            )}
        />
    );
}

// Skeleton for text lines
export function SkeletonText({ className, lines = 1 }: SkeletonProps & { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton key={i} className={cn("h-4", i === lines - 1 ? "w-3/4" : "w-full", className)} />
            ))}
        </div>
    );
}

// Skeleton for circular avatars/badges
export function SkeletonCircle({ className, size = "md" }: SkeletonProps & { size?: "sm" | "md" | "lg" | "xl" }) {
    const sizes = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-20 h-20",
    };

    return (
        <Skeleton className={cn("rounded-full", sizes[size], className)} />
    );
}

// Skeleton for game cards
export function SkeletonCard({ className }: SkeletonProps) {
    return (
        <div className={cn("gamer-card p-4 space-y-4", className)}>
            <div className="flex items-center gap-4">
                <SkeletonCircle size="lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
            </div>
            <Skeleton className="h-2 w-full" />
            <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
            </div>
        </div>
    );
}

// Skeleton for leaderboard rows
export function SkeletonLeaderboardRow({ className }: SkeletonProps) {
    return (
        <div className={cn("flex items-center gap-3 p-3", className)}>
            <Skeleton className="w-8 h-6" />
            <SkeletonCircle size="sm" />
            <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="w-12 h-6" />
        </div>
    );
}

// Skeleton for the user rank hero section
export function SkeletonUserRankHero() {
    return (
        <div className="gamer-card p-4 sm:p-6 space-y-4">
            {/* Mobile Layout */}
            <div className="flex flex-col items-center gap-4 sm:hidden">
                <SkeletonCircle size="xl" className="rounded-2xl" />
                <div className="text-center space-y-2 w-full">
                    <Skeleton className="h-6 w-32 mx-auto" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                </div>
                <Skeleton className="h-2 w-full" />
                <div className="grid grid-cols-3 gap-4 w-full">
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                </div>
            </div>
            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center gap-6">
                <SkeletonCircle size="xl" className="rounded-2xl" />
                <div className="flex-1 space-y-3">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-2 w-full" />
                </div>
                <div className="grid grid-cols-3 gap-6">
                    <Skeleton className="h-16 w-16" />
                    <Skeleton className="h-16 w-16" />
                    <Skeleton className="h-16 w-16" />
                </div>
            </div>
        </div>
    );
}

// Skeleton for the podium section
export function SkeletonPodium() {
    return (
        <div className="gamer-card p-4 space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="flex items-end justify-center gap-2 py-4">
                <div className="flex-1 max-w-[100px] flex flex-col items-center gap-2">
                    <SkeletonCircle size="md" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-20 w-full rounded-t-lg" />
                </div>
                <div className="flex-1 max-w-[100px] flex flex-col items-center gap-2">
                    <SkeletonCircle size="lg" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-28 w-full rounded-t-lg" />
                </div>
                <div className="flex-1 max-w-[100px] flex flex-col items-center gap-2">
                    <SkeletonCircle size="md" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-16 w-full rounded-t-lg" />
                </div>
            </div>
        </div>
    );
}
