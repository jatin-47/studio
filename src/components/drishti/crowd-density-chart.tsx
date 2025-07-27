
"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ChartData {
    name: string;
    density: number;
    fill: string;
}

interface CrowdDensityChartProps {
    data: ChartData[]
}

export function CrowdDensityChart({ data }: CrowdDensityChartProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                    contentStyle={{
                        background: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                    }}
                />
                <Legend />
                <Bar dataKey="density" fill="hsl(var(--primary))" name="Crowd Density" />
            </BarChart>
        </ResponsiveContainer>
    )
}
