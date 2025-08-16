// app/community/page.tsx
export default function CommunityPage() {
  const posts = [
    {
      author: "Aisha · MY",
      time: "2h ago",
      text: "Any tips for building a first data portfolio project in SEA context?",
      tags: ["#portfolio", "#beginner"],
      likes: 14,
      replies: 5,
    },
    {
      author: "Minh · VN",
      time: "yesterday",
      text: "Found a nice free dataset about ASEAN tourism flows. Great for SQL practice.",
      tags: ["#dataset", "#sql"],
      likes: 22,
      replies: 9,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Community</h1>

        {/* create post */}
        <div className="rounded-xl border bg-white p-5 mb-6">
          <h2 className="text-lg font-semibold mb-3">Share something</h2>
          <textarea
            className="w-full rounded border p-3"
            rows={3}
            placeholder="Ask a question, share a win, or post a resource…"
          />
          <div className="mt-3 flex gap-2">
            <button className="rounded bg-blue-600 px-4 py-2 text-white">Post</button>
            <button className="rounded border border-gray-300 px-4 py-2">Attach</button>
          </div>
        </div>

        {/* feed */}
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((p, i) => (
            <article key={i} className="rounded-xl border bg-white p-5">
              <div className="mb-2 text-sm text-gray-500">{p.author} · {p.time}</div>
              <p className="text-gray-800">{p.text}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="text-xs rounded bg-gray-100 px-2 py-0.5">{t}</span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                <button>👍 {p.likes}</button>
                <button>💬 {p.replies}</button>
                <button className="ml-auto text-blue-700">Reply</button>
              </div>
            </article>
          ))}

          {/* leaderboard / sidebar */}
          <aside className="rounded-xl border bg-white p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Top contributors</h3>
            <ul className="space-y-2 text-sm">
              <li>• Alex (SG) — 1247 pts</li>
              <li>• Putri (ID) — 1180 pts</li>
              <li>• Minh (VN) — 1105 pts</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">Earn points by helping others and sharing resources.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
