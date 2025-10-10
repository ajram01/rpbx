// app/dashboard/_components/RecentActivityList.tsx

type ListingMeta = { listing_id: string; title: string | null; status?: string | null }
type MembershipMeta = { product_name: string; plan_code: string; status: string }
type ProfileMeta = { primary_industry?: string | null; status?: string | null }

// Known events
type ListingCreated = { id: string; type: "listing_created"; at: string; meta?: ListingMeta }
type ListingUpdated = { id: string; type: "listing_updated"; at: string; meta?: ListingMeta }
type MembershipUpdated = { id: string; type: "membership_updated"; at: string; meta?: MembershipMeta }
type ProfileUpdated = { id: string; type: "profile_updated"; at: string; meta?: ProfileMeta }

// Catch-all (unknown/extra) event
type UnknownActivity = { id: string; type: string; at: string; meta?: Record<string, unknown> }

type Activity = ListingCreated | ListingUpdated | MembershipUpdated | ProfileUpdated | UnknownActivity

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

// ---------- Type guards (no `any` needed) ----------
function isListingActivity(a: Activity): a is ListingCreated | ListingUpdated {
  return a.type === "listing_created" || a.type === "listing_updated"
}

function isMembershipActivity(a: Activity): a is MembershipUpdated {
  return a.type === "membership_updated"
}

function isProfileActivity(a: Activity): a is ProfileUpdated {
  return a.type === "profile_updated"
}

function toWords(s: string) {
  return s.replaceAll("_", " ")
}

/** Turn our typed activity into a friendly label + detail string. */
function formatLabel(a: Activity): { label: string; detail?: string } {
  if (isListingActivity(a)) {
    const title = a.meta?.title ?? "Listing"
    return { label: title, detail: a.type === "listing_created" ? "created" : "updated" }
  }

  if (isMembershipActivity(a)) {
    const m = a.meta
    const label = m?.product_name ?? "Membership"
    return { label, detail: m?.status ? `status: ${m.status}` : undefined }
  }

  if (isProfileActivity(a)) {
    const p = a.meta
    const detail = p?.primary_industry ? `updated (${p.primary_industry})` : "updated"
    return { label: "Investor profile", detail }
  }

  // Unknown/extra events
  return { label: toWords(a.type) }
}
