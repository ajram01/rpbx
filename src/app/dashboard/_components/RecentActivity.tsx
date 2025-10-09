// app/dashboard/_components/RecentActivityList.tsx
type Activity =
  | {
      id: string
      type: "listing_created" | "listing_updated"
      at: string // ISO
      meta?: { listing_id: string; title: string | null; status?: string | null }
    }
  | {
      id: string
      type: "membership_updated"
      at: string
      meta?: { product_name: string; plan_code: string; status: string }
    }
  | {
      id: string
      type: "profile_updated"
      at: string
      meta?: { primary_industry?: string | null; status?: string | null }
    }
  | {
      id: string
      type: string
      at: string
      meta?: any
    }

export default function RecentActivityList({ items }: { items: Activity[] }) {
  if (!items?.length) {
    return (
      <ul className="list-disc list-inside space-y-2">
        <li className="text-white/90">You’re all caught up.</li>
      </ul>
    )
  }

  return (
    <ul className="list-disc list-inside space-y-2">
      {items.map((a) => {
        const when = formatWhen(a.at)
        const { label, detail } = formatLabel(a)
        return (
          <li key={a.id} className="text-white">
            <span className="font-medium">{label}</span>
            {detail ? <> {detail}</> : null}
            <span className="opacity-90"> · {when}</span>
          </li>
        )
      })}
    </ul>
  )
}

/** If it's the same calendar day, show relative (“xh ago”), else show a short date. */
function formatWhen(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    const diffMs = now.getTime() - d.getTime()
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60)
    if (hours >= 1) return `${hours}h ago`
    if (minutes >= 1) return `${minutes}m ago`
    return "just now"
  }
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

/** Turn our typed activity into a friendly label + detail string. */
function formatLabel(a: Activity): { label: string; detail?: string } {
  switch (a.type) {
    case "listing_created": {
      const title = (a.meta as any)?.title ?? "Listing"
      return { label: title, detail: "created" }
    }
    case "listing_updated": {
      const title = (a.meta as any)?.title ?? "Listing"
      return { label: title, detail: "updated" }
    }
    case "membership_updated": {
      const m = (a.meta as any) || {}
      const label = m.product_name ?? "Membership"
      return { label, detail: m.status ? `status: ${m.status}` : undefined }
    }
    case "profile_updated": {
      const p = (a.meta as any) || {}
      const label = "Investor profile"
      const detail = p.primary_industry ? `updated (${p.primary_industry})` : "updated"
      return { label, detail }
    }
    default: {
      // Fallback for any unexpected event types
      return { label: a.type.replaceAll("_", " ") }
    }
  }
}