// app/dashboard/_components/RecentActivity.tsx
type Activity = { id: string; type: string; at: string; meta?: any };
type Props = { userType: "business" | "investor" | "admin"; activities: Activity[] };
export default function RecentActivity({ activities }: Props) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-3">Recent Activity</h2>
      {activities.length === 0 ? (
        <p className="text-neutral-600">No recent activity yet.</p>
      ) : (
        <ul className="space-y-2">
          {activities.map(a => (
            <li key={a.id} className="p-4 border rounded-xl">
              <div className="font-medium">{a.type}</div>
              <div className="text-sm text-neutral-600">{new Date(a.at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
