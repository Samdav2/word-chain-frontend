'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from "@/contexts/AuthContext";
import { GameProvider } from "@/contexts/GameContext";
import { getQueryClient } from "@/lib/queryClient";

export function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <GameProvider>
                    {children}
                </GameProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
