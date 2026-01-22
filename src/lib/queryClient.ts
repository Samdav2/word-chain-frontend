'use client';

import { QueryClient } from '@tanstack/react-query';

// Create a client with optimal settings for slow networks
function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Data is considered fresh for 1 minute
                staleTime: 60 * 1000,
                // Cache data for 5 minutes
                gcTime: 5 * 60 * 1000,
                // Retry twice with exponential backoff
                retry: 2,
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
                // Don't refetch on window focus (saves bandwidth on slow networks)
                refetchOnWindowFocus: false,
                // Don't refetch on reconnect automatically
                refetchOnReconnect: 'always',
                // Show stale data while fetching new data
                placeholderData: 'keepPrevious' as const,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server: always make a new query client
        return makeQueryClient();
    } else {
        // Browser: make a new query client if we don't already have one
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}
