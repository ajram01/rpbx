// app/dashboard/_components/MatchedBusinesses.tsx
type Listing = {
  id: string;
  title?: string | null;
  industry?: string | null; // <-- updated
};

export default function MatchedBusinesses({ matches }: { matches: Listing[] }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-3">Suggested Businesses</h2>
      {matches.length === 0 ? (
        <p className="text-neutral-600">No matches yet.</p>
      ) : (
        <ul className="grid lg:grid-cols-4 gap-4">
          {matches.map((l) => (
            <li key={l.id} className="p-4 border rounded-xl">
              <div className="font-medium">{l.title ?? "Untitled Listing"}</div>
              <div className="text-sm text-neutral-600">{l.industry ?? "—"}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
