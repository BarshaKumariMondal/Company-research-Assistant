"use client"

import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import type { FinancialData } from '@/lib/types';

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

type FinancialChartProps = {
  data: FinancialData[];
};

export default function FinancialChart({ data }: FinancialChartProps) {
  return (
      <div>
        <h3 className="text-lg font-medium">Financial Performance</h3>
        <p className="text-sm text-muted-foreground mb-4">Revenue vs. Profit over the last 6 months (in millions).</p>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
            </BarChart>
        </ChartContainer>
      </div>
  )
}
