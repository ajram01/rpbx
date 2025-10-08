// lib/sanity/getUpcomingEvents.ts
import { groq } from "next-sanity";
import { eventClient } from "@/sanity/client";

/**
 * We try to be resilient to slightly different field names:
 * - start date: `startAt` or `date` (many event schemas use one of these)
 * - slug: object or plain, we normalize to string
 * - location: optional string
 *
 * Adjust the GROQ if your schema differs, but this will work for common patterns.
 */
export type EventItem = {
  title: string;
  slug: string;
  date: string; // ISO
  location?: string | null;
};

const EVENTS_QUERY = groq`*[
  _type == "event" &&
  // choose whichever date field exists and is in the future
  dateTime(coalesce(startAt, date, _createdAt)) >= now()
] | order(coalesce(startAt, date, _createdAt) asc)[0...3]{
  title,
  "slug": select(
    defined(slug.current) => slug.current,
    defined(slug) && slug match "*": slug,
    _id
  ),
  // normalize date to ISO string (fall back to createdAt if missing)
  "date": coalesce(startAt, date, _createdAt),
  // support either string or object location; if object, pick a common prop
  "location": select(
    defined(location) && location match "*": location,
    defined(location.name) => location.name,
    defined(venue) && venue match "*": venue,
  )
}`;

export async function getUpcomingEvents(): Promise<EventItem[]> {
  const data = await eventClient.fetch<
    Array<{
      title?: string;
      slug?: string;
      date?: string;
      location?: string;
    }>
  >(EVENTS_QUERY);

  return (data ?? [])
    .map((e) => ({
      title: e.title ?? "Untitled Event",
      slug: e.slug ?? "",
      date: e.date ?? new Date().toISOString(),
      location: e.location ?? null,
    }))
    .filter((e) => e.slug !== "");
}
