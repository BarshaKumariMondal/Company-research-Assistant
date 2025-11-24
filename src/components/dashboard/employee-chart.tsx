"use client"

import { Line, LineChart, CartesianGrid, XAxis, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { EmployeeData } from '@/lib/types';


const chartConfig = {
  count: {
    label: "Employees",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

type EmployeeChartProps = {
    data: EmployeeData[];
};

export default function EmployeeChart({ data }: EmployeeChartProps) {
  return (
    <div>
        <h3 className="text-lg font-medium">Employee Growth</h3>
        <p className="text-sm text-muted-foreground mb-4">Headcount over the last 5 years.</p>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <LineChart accessibilityLayer data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="year"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                    dataKey="count"
                    type="monotone"
                    stroke="var(--color-count)"
                    strokeWidth={3}
                    dot={{
                        fill: "var(--color-count)",
                    }}
                    activeDot={{
                        r: 6,
                    }}
                />
            </LineChart>
        </ChartContainer>
    </div>
  )
}
