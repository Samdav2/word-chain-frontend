'use client';

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/common/ui';

const data = [
    { subject: 'Speed', A: 120, fullMark: 150 },
    { subject: 'Accuracy', A: 98, fullMark: 150 },
    { subject: 'Complexity', A: 86, fullMark: 150 },
    { subject: 'Consistency', A: 99, fullMark: 150 },
    { subject: 'Vocabulary', A: 85, fullMark: 150 },
    { subject: 'Focus', A: 65, fullMark: 150 },
];

export default function SkillRadar() {
    return (
        <Card className="p-6 h-[400px]">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Skill Analysis</h3>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" stroke="var(--muted-foreground)" />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="var(--muted-foreground)" />
                    <Radar
                        name="Student"
                        dataKey="A"
                        stroke="var(--primary)"
                        fill="var(--primary)"
                        fillOpacity={0.4}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </Card>
    );
}
