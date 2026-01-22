import Link from "next/link";
import { LayoutDashboard, Plus } from "lucide-react";

export const runtime = "edge";

type Topic = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string | null;
};

export default async function Home() {
  // 1️⃣ Fetch topics from API (Edge-safe)
  const topicsRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/topics`,
    { cache: "no-store" }
  );

  const allTopics: Topic[] = topicsRes.ok ? await topicsRes.json() : [];

  // 2️⃣ Fetch session/admin info from API (Edge-safe)
  const sessionRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/session`,
    { cache: "no-store" }
  );

  const { isAdmin } = sessionRes.ok
    ? await sessionRes.json()
    : { isAdmin: false };

  return (
    <div className="min-h-screen p-8">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          LMS Platform
        </h1>

        <Link
          href="/admin"
          className="text-sm font-medium text-white hover:text-blue-400 transition-colors flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10"
        >
          <LayoutDashboard size={16} /> Admin Dashboard
        </Link>
      </header>

      <main className="max-w-7xl mx-auto">
        {allTopics.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5">
            <p className="text-2xl text-gray-500 font-medium">
              No topics available yet.
            </p>

            {isAdmin && (
              <Link
                href="/admin"
                className="mt-4 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
              >
                <Plus size={20} /> Create your first topic
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allTopics.map((topic) => (
              <Link
                href={`/topics/${topic.id}`}
                key={topic.id}
                className="group relative block h-[300px] rounded-3xl overflow-hidden bg-black/40 border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                {topic.thumbnailUrl ? (
                  <img
                    src={topic.thumbnailUrl}
                    alt={topic.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-emerald-900/40 opacity-60" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8 flex flex-col justify-end">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {topic.title}
                  </h2>
                  <p className="text-gray-300 line-clamp-2">
                    {topic.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
