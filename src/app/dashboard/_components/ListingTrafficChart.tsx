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
  pagePaths: string[];                 // GA4 pagePath values to chart as series
  seriesLabels?: Record<string, string>; // map pagePath -> nice label
  months?: number;                     // default 6
  emptyNote?: string;                  // optional custom copy for empty state
};

// ---- Types for API contract ----
type PageviewsRequest = { pagePaths: string[]; months: number; };
type ChartRow = { month: string } & Partial<Record<`/${string}`, number>>;
type PageviewsResponse = { data: ChartRow[] };

// ---- Helpers ----
const postJson = async (url: string, body: PageviewsRequest): Promise<PageviewsResponse> => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Analytics request failed: ${res.status}`);
  return res.json() as Promise<PageviewsResponse>;
};

function monthLabels(count: number): string[] {
  const today = new Date();
  const labels: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    labels.push(d.toLocaleString("en-US", { month: "long" }));
  }
  return labels;
}

export default function ListingTrafficChart({
  title,
  description,
  pagePaths,
  seriesLabels,
  months = 6,
  emptyNote = "No data yet — check back soon after visitors land on these pages.",
}: Props) {
  // Typed SWR key: [url, body]
  const swrKey =
    pagePaths.length > 0
      ? (["/api/analytics/pageviews", { pagePaths, months }] as const)
      : null;

  const { data, error, isLoading } = useSWR<PageviewsResponse, Error, typeof swrKey>(
    swrKey,
    (key) => {
      const [url, body] = key;
      return postJson(url, body);
    },
    { revalidateOnFocus: false }
  );

  const chartData: ChartRow[] = data?.data ?? [];

  // Series keys present in GA response (exclude the x-axis "month")
  const keys = useMemo(() => {
    if (!chartData.length) return [] as string[];
    const sample = chartData[0];
    return Object.keys(sample).filter((k) => k !== "month");
  }, [chartData]);

  // Build config dynamically for detected series
  const chartConfig: ChartConfig = useMemo(() => {
    const cfg: ChartConfig = {};
    keys.forEach((k, idx) => {
      cfg[k] = {
        label: seriesLabels?.[k] ?? k,
        color: `var(--chart-${(idx % 8) + 1})`,
      };
    });
    return cfg;
  }, [keys, seriesLabels]);

  // If there is NO data yet (new user, no traffic), render a skeletal chart:
  const isEmpty =
    !pagePaths.length ||                       // nothing to track yet
    isLoading ||                               // still fetching – show skeleton
    (!!pagePaths.length && chartData.length === 0); // no GA rows returned

  // Placeholder rows so the axis/grid render nicely (no <Area> lines)
  const placeholderData: ChartRow[] = useMemo(
    () => monthLabels(months).map((m) => ({ month: m })),
    [months]
  );

  // Decide which dataset to feed the chart
  const dataToRender = isEmpty ? placeholderData : chartData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="relative">
        {/* Top-right hint for empty state */}
        {isEmpty && (
          <div
            className="absolute right-2 top-2 text-xs rounded-md px-2 py-1 bg-neutral-100 text-neutral-700 border border-neutral-200"
            title={emptyNote}
          >
            ℹ️ {emptyNote}
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm mb-2">
            Failed to load analytics.
          </div>
        )}

        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={dataToRender}
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

            {/* Tooltip only if we have real data/series */}
            {!isEmpty && (
              <>
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
                    className={`[--color-${k}:var(${chartConfig[k]?.color || "black"})]`}
                  />
                ))}
                <ChartLegend content={<ChartLegendContent />} />
              </>
            )}
          </AreaChart>
        </ChartContainer>

        {/* Optional: tiny loading text (kept subtle since we show skeleton) */}
        {isLoading && (
          <div className="text-xs text-neutral-500 mt-2">Loading…</div>
        )}
      </CardContent>
    </Card>
  );
}
