'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import LogoLoader from './LogoLoader';

type NormalizedPrice = {
  id: string;
  lookup_key: string | null;
  currency: string;                    // e.g., "USD"
  unit_amount: number | null;          // cents
  interval: 'day' | 'week' | 'month' | 'year' | null;
  interval_count: number | null;
  productId: string;
  productName: string;
  productDescription: string | null;
  features: string[];
  metadata: Record<string, string>;
  popular?: boolean;                   // server can set, or derive from metadata
  sortOrder?: number;                  // server can set, or derive from metadata
};

interface PricingTabProps {
  yearly: boolean;
  popular?: boolean;
  planName: string;
  price: { monthly: number | null; yearly: number | null };
  planDescription: string;
  features: string[];
  checkoutLookup?: string | null;
  isFree?: boolean;
}

function PricingTab(props: PricingTabProps) {
  // Choose a sensible display even if the free plan lacks one of the intervals:
  const displayCents = props.yearly
    ? (props.price.yearly ?? props.price.monthly)
    : (props.price.monthly ?? props.price.yearly);

  const period = props.yearly
    ? (props.price.yearly != null ? '/yr' : props.price.monthly != null ? '/mo' : '')
    : (props.price.monthly != null ? '/mo' : props.price.yearly != null ? '/yr' : '');

  const href = props.checkoutLookup
    ? `/subscribe/${encodeURIComponent(props.checkoutLookup)}`
    : '#';

  return (
    <div className={`w-full`}>
      <div className="relative flex flex-col h-full p-6 rounded-2xl bg-white border border-slate-200 shadow shadow-slate-950/5">
        {props.popular && (
          <div className="absolute top-0 right-0 mr-6 -mt-4">
            <div className="inline-flex items-center text-xs font-semibold py-1.5 px-3 bg-[#60BC9B] text-white rounded-full shadow-sm shadow-slate-950/5">
              Most Popular
            </div>
          </div>
        )}

        <div className="mb-5">
          <div className="text-slate-900 font-semibold mb-2"><h4>{props.planName}</h4></div>

          <div className="inline-flex items-baseline mb-1">
            <span className="text-slate-900 font-bold text-3xl">$</span>
            <span className="text-slate-900 font-bold text-4xl">
              {displayCents != null ? (displayCents / 100).toFixed(0) : props.isFree ? '0' : '-'}
            </span>
            <span className="text-slate-500 font-medium">
              {props.isFree && displayCents == null ? '' : period}
            </span>
          </div>

          <div className="text-sm text-slate-500 mb-5">{props.planDescription}</div>

          <Link
            href={href}
            onClick={(e) => { if (!props.checkoutLookup) e.preventDefault(); }}
            aria-disabled={!props.checkoutLookup}
            className={`w-full inline-flex justify-center whitespace-nowrap rounded-full px-3.5 py-2.5 text-sm font-medium text-white transition-colors duration-150 ${
              props.checkoutLookup
                ? 'bg-[#60BC9B] hover:bg-[#4ba88a] focus-visible:outline-none focus-visible:ring-[#60BC9B]'
                : 'bg-slate-400 cursor-not-allowed'
            }`}
          >
            {props.isFree ? 'Join Free' : 'Purchase Plan'}
          </Link>
        </div>

        <div className="text-slate-900 font-medium mb-3"><p className='font-semibold'>Includes:</p></div>
        <ul className="text-slate-600 text-sm space-y-3 grow">
          {(props.features.length ? props.features : ['Feature A', 'Feature B', 'Feature C']).map((feature, i) => (
            <li key={i} className="flex items-center">
              <svg className="w-3 h-3 fill-[#60BC9B] mr-3 shrink-0" viewBox="0 0 12 12">
                <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
              </svg>
              <span><p className='text-grey'>{feature}</p></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function PricingTable() {
  const [isAnnual, setIsAnnual] = useState(false); // Monthly by default
  const [prices, setPrices] = useState<NormalizedPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/pricing', { cache: 'no-store' });
        const data: NormalizedPrice[] = await res.json();
        setPrices(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Group prices by product (or lookup stem), capture monthly/yearly, popular, free, sort order.
  const plans = useMemo(() => {
    type Group = {
      planName: string;
      planDescription: string;
      monthly: number | null;
      yearly: number | null;
      lookupMonthly: string | null;
      lookupYearly: string | null;
      features: string[];
      popular: boolean;
      isFree: boolean;
      sortOrder: number; // lower = earlier
    };

    const map = new Map<string, Group>();

    for (const p of prices) {
      const stem =
        (p.lookup_key?.replace(/_(monthly|yearly)$/i, '') ||
          p.productName.toLowerCase().replace(/\s+/g, '_')) ?? 'plan';

      const existing = map.get(stem);

      // Popular from server or metadata
      const isPopular =
        (typeof p.popular === 'boolean' && p.popular) ||
        ((p.metadata?.popular || '').toLowerCase() === 'true');

      // Free if zero amount (recurring $0 is fine)
      const isFree = (p.unit_amount ?? 0) === 0;

      // Sort order: prefer server-provided p.sortOrder; else metadata.sort_order/order; else 999
      const rawOrder = (p.sortOrder as number | undefined) ?? parseInt(
        (p.metadata?.sort_order ?? p.metadata?.order ?? ''), 10
      );
      const order = Number.isFinite(rawOrder as number) ? (rawOrder as number) : 999;

      const g: Group =
        existing ?? {
          planName: p.productName,
          planDescription: p.productDescription ?? '',
          monthly: null,
          yearly: null,
          lookupMonthly: null,
          lookupYearly: null,
          features: p.features ?? [],
          popular: false,
          isFree,
          sortOrder: order,
        };

      if (p.interval === 'month') {
        g.monthly = p.unit_amount;
        g.lookupMonthly = p.lookup_key ?? null;
      }
      if (p.interval === 'year') {
        g.yearly = p.unit_amount;
        g.lookupYearly = p.lookup_key ?? null;
      }

      // Carry forward flags; keep the smallest order seen for the group
      g.popular = g.popular || isPopular;
      g.isFree = g.isFree || isFree;
      g.sortOrder = Math.min(g.sortOrder, order);

      // Optional: features from metadata (pipe-separated)
      if (!g.features.length && p.metadata?.features) {
        g.features = p.metadata.features.split('|').map(s => s.trim()).filter(Boolean);
      }

      map.set(stem, g);
    }

    // Sort groups: by sortOrder then by name (stable, predictable)
    return Array.from(map.values()).sort(
      (a, b) => (a.sortOrder - b.sortOrder) || a.planName.localeCompare(b.planName)
    );
  }, [prices]);

  // Filter: show only monthly on Monthly, yearly on Annual — but always include free.
  const visiblePlans = useMemo(
    () => plans.filter(p => p.isFree ? true : (isAnnual ? p.yearly != null : p.monthly != null)),
    [plans, isAnnual]
  );

  // For checkout: if free is shown on the "other" tab, fall back to the lookup that exists.
  const getCheckoutLookup = (p: (typeof plans)[number]) =>
    p.isFree
      ? (p.lookupMonthly ?? p.lookupYearly ?? null)
      : (isAnnual ? p.lookupYearly : p.lookupMonthly);

  if (loading) return <div><p className='text-white'>Loading pricing…</p></div>;

  return (
    <div>
      {/* Toggle */}
      <div className="flex justify-center max-w-[18rem] m-auto mb-8 lg:mb-16">
        <div className="relative flex w-full p-1 bg-white rounded-full">
          <span className="absolute inset-0 m-1 pointer-events-none" aria-hidden="true">
            <span
              className={`absolute inset-0 w-1/2 bg-[#60BC9B] rounded-full shadow-sm shadow-[#60BC9B] transition-transform duration-150 ease-in-out ${
                !isAnnual ? 'translate-x-0' : 'translate-x-full'
              }`}
            />
          </span>

          <button
            className={`relative flex-1 text-sm font-medium h-8 rounded-full ${
              !isAnnual ? 'text-white' : 'text-slate-500'
            }`}
            onClick={() => setIsAnnual(false)}
            aria-pressed={!isAnnual}
          >
            Monthly
          </button>

          <button
            className={`relative flex-1 text-sm font-medium h-8 rounded-full ${
              isAnnual ? 'text-white' : 'text-slate-500'
            }`}
            onClick={() => setIsAnnual(true)}
            aria-pressed={isAnnual}
          >
            Annual <span className={isAnnual ? 'text-[#E5FFF8]' : 'text-[#60BC9B]'}>Save 20%</span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-[1140px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visiblePlans.map((p) => (
          <PricingTab
            key={`${p.planName}-${isAnnual ? 'year' : 'month'}`}
            yearly={isAnnual}
            popular={p.popular}
            planName={p.planName}
            planDescription={p.planDescription}
            price={{ monthly: p.monthly, yearly: p.yearly }}
            features={p.features}
            checkoutLookup={getCheckoutLookup(p)}
            isFree={p.isFree}
          />
        ))}
      </div>
      </div>
    </div>
  );
}
