"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface WaitTimeChartProps {
    data: { name: string; waitTime: number }[];
}

const chartConfig = {
  waitTime: {
    label: "Wait Time (min)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function WaitTimeChart({ data }: WaitTimeChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 6)}
        />
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="waitTime" fill="var(--color-waitTime)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
