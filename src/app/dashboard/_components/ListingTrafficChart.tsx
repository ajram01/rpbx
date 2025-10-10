"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";

type Props = {
  title: string;
  description: string;
  pagePaths: string[];        // GA4 pagePath values to chart as series
  seriesLabels?: Record<string,string>; // map pagePath -> nice label
  months?: number;            // default 6
};

const fetcher = (url: string, body: any) =>
  fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    .then((r) => r.json());

export default function ListingTrafficChart({ title, description, pagePaths, seriesLabels, months = 6 }: Props) {
  const { data, error, isLoading } = useSWR(
    pagePaths.length ? ["/api/analytics/pageviews", { pagePaths, months }] : null,
    ([url, body]) => fetcher(url, body),
    { revalidateOnFocus: false }
  );

  const chartData = data?.data ?? [];

  // Build config + keys dynamically
  const keys = useMemo(() => {
    if (!chartData.length) return [] as string[];
    const sample = chartData[0];
    return Object.keys(sample).filter((k) => k !== "month");
  }, [chartData]);

  const chartConfig: ChartConfig = useMemo(() => {
    const cfg: ChartConfig = {};
    keys.forEach((k, idx) => {
      cfg[k] = {
        label: seriesLabels?.[k] ?? k,
        // uses CSS vars you already have (chart-1..chart-8); cycles if >8
        color: `var(--chart-${(idx % 8) + 1})`,
      };
    });
    return cfg;
  }, [keys, seriesLabels]);

  if (!pagePaths.length) {
    return (
      <Card><CardHeader><CardTitle>{title}</CardTitle><CardDescription>No pages to chart.</CardDescription></CardHeader></Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-600 text-sm">Failed to load analytics.</div>}
        {isLoading && <div className="text-sm">Loading…</div>}
        {!!chartData.length && (
          <ChartContainer config={chartConfig}>
            <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v) => (v as string).slice(0, 3)} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              {keys.map((k) => (
                <Area
                  key={k}
                  dataKey={k}
                  type="natural"
                  fill={`var(--color-${k})`}
                  fillOpacity={0.4}
                  stroke={`var(--color-${k})`}
                  // fallback to ChartContainer's assigned color if the var isn't defined
                  className={`[--color-${k}:var(${chartConfig[k]?.color || "black"})]`}
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
