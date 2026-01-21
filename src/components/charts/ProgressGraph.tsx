'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/common/ui';

const data = [
    { name: 'Week 1', score: 400 },
    { name: 'Week 2', score: 300 },
    { name: 'Week 3', score: 550 },
    { name: 'Week 4', score: 800 },
    { name: 'Week 5', score: 750 },
    { name: 'Week 6', score: 1200 },
];

export default function ProgressGraph() {
    return (
        <Card className="p-6 h-[400px]">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Vocabulary Mastery Over Time</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip
                        contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '0.5rem' }}
                        itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}
