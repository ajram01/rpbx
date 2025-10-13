"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

type Props = {
  title: string;
  description: string;
  pagePaths: string[]; // GA4 pagePath values to chart as series
  seriesLabels?: Record<string, string>; // map pagePath -> nice label
  months?: number; // default 6
};

// ---- Types for API contract ----
type PageviewsRequest = {
  pagePaths: string[];
  months: number;
};

type ChartRow = { month: string } & Record<string, number>; // { month: "January", "/listing/a": 10, "/listing/b": 7 }
type PageviewsResponse = { data: ChartRow[] };

// ---- Typed fetcher for SWR (tuple key) ----
const postJson = async (url: string, body: PageviewsRequest): Promise<PageviewsResponse> => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Analytics request failed: ${res.status}`);
  }
  return res.json() as Promise<PageviewsResponse>;
};

export default function ListingTrafficChart({
  title,
  description,
  pagePaths,
  seriesLabels,
  months = 6,
}: Props) {
  // Build a typed SWR key: [url, body]
  const swrKey =
    pagePaths.length > 0
      ? (["/api/analytics/pageviews", { pagePaths, months }] as const)
      : null;

  const { data, error, isLoading } = useSWR<PageviewsResponse, Error, typeof swrKey>(
    swrKey,
    // fetcher receives the same tuple type as swrKey
    (key) => {
      const [url, body] = key;
      return postJson(url, body);
    },
    { revalidateOnFocus: false }
  );

  const chartData: ChartRow[] = data?.data ?? [];

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
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>No pages to chart.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-600 text-sm">Failed to load analytics.</div>
        )}
        {isLoading && <div className="text-sm">Loading…</div>}
        {!!chartData.length && (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(v: unknown) =>
                  (typeof v === "string" ? v : String(v)).slice(0, 3)
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
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
