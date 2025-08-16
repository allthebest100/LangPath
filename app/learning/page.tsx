// app/learning/page.tsx
export default function LearningPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Learning</h1>

        {/* progress + quick stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-600">Learning progress</p>
            <p className="text-2xl font-bold text-gray-900">68%</p>
            <div className="mt-3 h-2 rounded-full bg-gray-200">
              <div className="h-full w-2/3 rounded-full bg-blue-600"></div>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-600">Modules completed</p>
            <p className="text-2xl font-bold text-gray-900">7 / 10</p>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-gray-600">Study streak</p>
            <p className="text-2xl font-bold text-gray-900">15 days</p>
          </div>
        </div>

        {/* modules list */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Your modules</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Intro to Data Analysis", level: "Beginner", progress: 80 },
              { title: "Python Essentials", level: "Beginner", progress: 60 },
              { title: "SQL for Analysts", level: "Intermediate", progress: 35 },
              { title: "Data Visualization", level: "Intermediate", progress: 15 },
            ].map((m) => (
              <div key={m.title} className="rounded-xl border bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{m.title}</h3>
                    <p className="text-xs text-gray-500">{m.level}</p>
                  </div>
                  <span className="text-sm text-gray-700">{m.progress}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  <a href="/chatbot" className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white">
                    Ask mentor
                  </a>
                  <button className="rounded border border-gray-300 px-3 py-1.5 text-sm">
                    Resume
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* weekly plan */}
        <section className="mb-12">
          <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your 4-week plan</h2>
              <a href="/chatbot" className="text-sm text-blue-700 underline">
                Generate / refine in chatbot
              </a>
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Week 1 — Python basics, 30 mins/day</li>
                <li>Week 2 — Pandas & data cleaning</li>
                <li>Week 3 — SQL joins & queries</li>
                <li>Week 4 — Visualization mini-project</li>
              </ul>
              <div className="rounded border bg-gray-50 p-3">
                Notes: Keep sessions short and consistent. Track progress each weekend.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
