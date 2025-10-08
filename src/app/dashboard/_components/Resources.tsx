// app/dashboard/_components/Resources.tsx
export default function Resources({ userType }: { userType: "business" | "investor" | "admin" }) {
  return (
    <section className="mt-8 mb-12">
      <h2 className="text-xl font-semibold mb-3">Resources</h2>
      <div className="grid lg:grid-cols-3 gap-4">
        <a href="/help" className="p-4 border rounded-xl hover:bg-neutral-50">Help Center</a>
        <a href="/blog" className="p-4 border rounded-xl hover:bg-neutral-50">Blog</a>
        <a href="/contact" className="p-4 border rounded-xl hover:bg-neutral-50">
          {userType === "business" ? "Talk to Success Team" : "Talk to Support"}
        </a>
      </div>
    </section>
  );
}
