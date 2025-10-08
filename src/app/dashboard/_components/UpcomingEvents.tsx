// app/dashboard/_components/UpcomingEvents.tsx
type Event = { title: string; slug: string; date: string; location?: string | null };
export default function UpcomingEvents({ events }: { events: Event[] }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-3">Upcoming Events</h2>
      {events.length === 0 ? (
        <p className="text-neutral-600">No upcoming events.</p>
      ) : (
        <ul className="grid lg:grid-cols-3 gap-4">
          {events.map((e) => (
            <li key={e.slug} className="p-4 border rounded-xl">
              <div className="font-medium">{e.title}</div>
              <div className="text-sm text-neutral-600">
                {new Date(e.date).toLocaleDateString()} {e.location ? `• ${e.location}` : ""}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
