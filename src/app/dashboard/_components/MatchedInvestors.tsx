// app/dashboard/_components/InvestorCards.tsx
import Image from "next/image";

type InvestorMatch = {
  id: string;
  score?: number | null;
  primary_industry?: string | null;
  additional_industries?: string[] | null;
};

export default function MatchedInvestors({ matches }: { matches: InvestorMatch[] }) {
  if (!matches?.length) return <p>No matches yet — check back soon.</p>;

  return (
    <>
      {matches.map((m) => (
        <div key={m.id} className="flex-1 ">
          <Image
            src="/images/test/chen-lee.png"
            alt="Investor Avatar"
            className="rounded-t-lg w-full shadow-lg border-x-2 border-t-2 border-gray-500"
            width={200}
            height={100}
          />
          <div className="bg-[#F3F3F3] p-5 rounded-b-lg shadow-lg border-x-2 border-b-2 border-gray-500">
            <h4>Investor #{m.id.slice(0, 6)}</h4>
            <p className="italic">{m.primary_industry ?? "—"}</p>
            <button className="mt-3 w-full rounded-lg bg-black text-white py-2">View Profile</button>
          </div>
        </div>
      ))}
    </>
  );
}
