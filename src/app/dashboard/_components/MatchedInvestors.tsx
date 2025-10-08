// app/dashboard/_components/MatchedInvestors.tsx
type InvestorMatch = {
  id: string;
  created_at: string | null;
  score?: number | null;
  primary_industry?: string | null;          // optional to display later
  additional_industries?: string[] | null;   // optional to display later
};

type Listing = { id: string; title?: string | null };

export default function MatchedInvestors({
  matches,
  listings
}: {
  matches: InvestorMatch[];
  listings: Listing[];
}) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-3">Suggested Investors</h2>
      {matches.length === 0 ? (
        <p className="text-neutral-600">No matches yet.</p>
      ) : (
        <ul className="grid lg:grid-cols-4 gap-4">
          {matches.map((m) => (
            <li key={m.id} className="p-4 border rounded-xl">
              <div className="font-medium">Investor #{m.id.slice(0, 6)}</div>
              <div className="text-sm text-neutral-600">Score: {m.score ?? 0}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
