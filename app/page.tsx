// app/page.tsx
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* hero */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your personalized learning journey for Southeast Asia
            </h1>
            <p className="text-gray-600 mb-6">
              Discover career paths, scholarships, and regional opportunities. Learn with an AI mentor and a supportive community.
            </p>
            <div className="flex gap-3">
              <a
                href="/chatbot"
                className="inline-block rounded bg-blue-600 text-white px-5 py-2.5"
              >
                Try the chatbot
              </a>
              <a
                href="/learning"
                className="inline-block rounded border border-gray-300 px-5 py-2.5 text-gray-800"
              >
                Explore learning
              </a>
            </div>
          </div>

          {/* simple illustration placeholder */}
          <div className="rounded-xl border bg-white p-6">
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 rounded-lg bg-gray-100" />
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Minimal mockup — replace with your own illustration later.
            </p>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why LangPath</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-xl border bg-white p-6">
            <div className="mb-3 text-2xl">🤖</div>
            <h3 className="font-semibold text-gray-900 mb-1">AI-powered guidance</h3>
            <p className="text-gray-600 text-sm">
              Personalized recommendations and learning roadmaps tailored to your interests and region.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <div className="mb-3 text-2xl">🌐</div>
            <h3 className="font-semibold text-gray-900 mb-1">Regional focus</h3>
            <p className="text-gray-600 text-sm">
              Scholarships, jobs and courses curated for Southeast Asian learners.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <div className="mb-3 text-2xl">👥</div>
            <h3 className="font-semibold text-gray-900 mb-1">Peer community</h3>
            <p className="text-gray-600 text-sm">
              Share experiences, ask questions and grow with others on similar paths.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
