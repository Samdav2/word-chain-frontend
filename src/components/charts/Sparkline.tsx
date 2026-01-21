'use client';

import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

interface SparklineProps {
    data: { value: number }[];
    color?: string;
}

export default function Sparkline({ data, color = '#6366f1' }: SparklineProps) {
    return (
        <div className="h-16 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <Tooltip
                        contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '0.5rem' }}
                        itemStyle={{ color: 'var(--foreground)' }}
                        cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
