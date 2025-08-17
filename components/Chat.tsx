"use client";

import { useState, useRef, useEffect } from "react";

type Msg = { role: "user" | "assistant"; content: string };

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

export default function Chat() {
  // left panel
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  // right panel
  const [keywords, setKeywords] = useState("");
  const [reco, setReco] = useState("");
  const [plan, setPlan] = useState("");

  // globals
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState("id");
  const [country, setCountry] = useState("Indonesia");

  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading]);

  // unified primary button style
  const primaryBtn =
    "px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400";

  // helper for calling the API (always includes locale/country)
  async function postToAPI(payload: any) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: lang, country, ...payload }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Request failed");
    return data as { reply?: string };
  }

  // left: send message (with explicit Msg typing to satisfy TS)
  async function send() {
    if (!input.trim()) return;

    // ✅ Explicitly type the new message to avoid literal widening
    const userMsg: Msg = { role: "user", content: input };
    const next: Msg[] = [...messages, userMsg];

    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const data = await postToAPI({ messages: next });

      // ✅ Explicitly type the assistant message too
      const botMsg: Msg = { role: "assistant", content: data.reply || "" };
      setMessages([...next, botMsg]);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) send();
  }

  // right: recommendations (same language)
  async function generateRecommendations() {
    if (!keywords.trim()) return;
    setReco("");
    setLoading(true);
    setError(null);
    try {
      const data = await postToAPI({
        messages: [
          {
            role: "user",
            content:
              `My interest keywords: "${keywords}". ` +
              "Please produce a concise list in the user's selected language, grouped into: " +
              "1) Skills/Topics to learn 2) Suggested resources/courses (generic names OK) " +
              "3) Project ideas 4) Internship/job tips. " +
              "Keep it practical (6–12 bullet points) and SEA-aware.",
          },
        ] as Msg[], // ensure messages array satisfies the Msg shape
      });
      setReco(data.reply || "");
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // right: 4-week plan (same language)
  async function generatePlan() {
    const goal =
      keywords.trim() ||
      messages
        .slice()
        .reverse()
        .find((m) => m.role === "user")?.content ||
      "(no goal provided)";

    setPlan("");
    setLoading(true);
    setError(null);
    try {
      const data = await postToAPI({
        messages: [
          {
            role: "user",
            content:
              `Generate a concise, practical 4-week self-study plan for: ${goal}. ` +
              "Respond in the user's selected language. " +
              "Organize by Week 1–4 with 3–4 actionable bullet points each, suitable for Southeast Asian learners.",
          },
        ] as Msg[],
      });
      setPlan(data.reply || "");
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* title + selectors */}
      <div className="flex flex-col gap-3 mb-4">
        <h1 className="text-2xl font-bold">SEA LION chatbot</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Language</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="border rounded px-3 py-2 bg-white"
              aria-label="Language"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Country</span>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="border rounded px-3 py-2 bg-white"
              aria-label="Country"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="space-y-3">
          <div className="border rounded p-3 h-72 overflow-y-auto bg-white">
            {messages.map((m, i) => (
              <div key={i} className={`mb-2 ${m.role === "user" ? "text-right" : ""}`}>
                <span
                  className={`inline-block px-3 py-2 rounded ${
                    m.role === "user" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}
            {loading && <div className="text-sm text-gray-500">...</div>}
            <div ref={endRef} />
          </div>

          <textarea
            className="w-full border rounded p-2"
            rows={3}
            placeholder="Type here... (Ctrl/Cmd + Enter to send)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
          />
          <div className="flex gap-2">
            <button onClick={send} disabled={loading} className={primaryBtn}>
              {loading ? "Sending..." : "Send"}
            </button>
            {error && <span className="text-red-600 text-sm">{error}</span>}
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white border rounded-xl p-4 space-y-4">
          <h3 className="font-semibold text-gray-900">Recommendations</h3>

          <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-3 py-2"
              placeholder="Keywords (e.g., data science, scholarship)"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <button
              onClick={generateRecommendations}
              className={primaryBtn}
              disabled={loading || !keywords.trim()}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {/* same textarea style so fonts match */}
          <textarea
            className="w-full border rounded p-2 min-h-[120px] bg-gray-50"
            value={reco}
            onChange={(e) => setReco(e.target.value)}
            placeholder="Click Generate to get recommendations..."
          />

          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">Your 4-week plan</label>
            <button onClick={generatePlan} className={primaryBtn} disabled={loading}>
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          <textarea
            className="w-full border rounded p-2 min-h-[160px] bg-gray-50"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            placeholder="Click Generate to get a study roadmap..."
          />

          <div className="flex gap-2">
            <button
              onClick={() => reco && navigator.clipboard.writeText(reco)}
              className="px-4 py-2 rounded bg-gray-200 text-gray-800"
            >
              Copy recommendations
            </button>
            <button
              onClick={() => plan && navigator.clipboard.writeText(plan)}
              className="px-4 py-2 rounded bg-gray-200 text-gray-800"
            >
              Copy plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
