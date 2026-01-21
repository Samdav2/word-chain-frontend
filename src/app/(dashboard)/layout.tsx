import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="text-xl font-bold text-primary hover:opacity-80 transition-opacity">
                                WordChain
                            </Link>
                        </div>
                        <div className="flex items-center space-x-6">
                            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Dashboard
                            </Link>
                            <Link href="/analytics" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Analytics
                            </Link>
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                U
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
