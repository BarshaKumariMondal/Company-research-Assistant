"use client"
import { Pie, PieChart, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import type { MarketShareData } from '@/lib/types';

const chartConfig = {
    value: { label: "Market Share" },
    "Innovate Corp": { label: "Innovate Corp" },
    "Competitor A": { label: "Competitor A" },
    "Competitor B": { label: "Competitor B" },
    "Others": { label: "Others" },
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--muted))"];

type MarketShareChartProps = {
    data: MarketShareData[];
};

export default function MarketShareChart({ data }: MarketShareChartProps) {
    const chartData = data.map((entry, index) => ({
        ...entry,
        fill: COLORS[index % COLORS.length]
    }));

  return (
    <div>
        <h3 className="text-lg font-medium">Market Share</h3>
        <p className="text-sm text-muted-foreground mb-4">Current market distribution.</p>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full aspect-square">
            <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} strokeWidth={5}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                    ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
        </ChartContainer>
    </div>
  )
}
