// app/profile/page.tsx
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "zh", label: "中文" },
  { code: "th", label: "ไทย" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "ms", label: "Bahasa Melayu" },
];

const COUNTRIES = [
  "Indonesia",
  "Singapore",
  "Malaysia",
  "Thailand",
  "Vietnam",
  "Philippines",
  "Cambodia",
  "Laos",
  "Myanmar",
  "Brunei",
];

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>

        {/* basic info */}
        <section className="rounded-xl border bg-white p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full name</label>
              <input className="w-full rounded border p-2" defaultValue="Alex Chen" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input className="w-full rounded border p-2" defaultValue="alex@example.com" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Country</label>
              <select className="w-full rounded border p-2" defaultValue="Singapore">
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Preferred language</label>
              <select className="w-full rounded border p-2" defaultValue="en">
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button className="rounded bg-blue-600 px-4 py-2 text-white">Save changes</button>
          </div>
        </section>

        {/* goals */}
        <section className="rounded-xl border bg-white p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Goals</h2>
          <textarea
            className="w-full rounded border p-3"
            rows={3}
            placeholder="Describe your short-term learning / career goals..."
            defaultValue="Break into data analytics within 6 months; build 2 portfolio projects."
          />
        </section>

        {/* saved items */}
        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Saved items</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            <li>Scholarship list — Indonesia undergrad (bookmark)</li>
            <li>Dataset: ASEAN tourism flows (for SQL practice)</li>
            <li>Guide: Build your first data visualization project</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
