"use client";
import { useState } from "react";
type Msg = { role: "user" | "assistant"; content: string };

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    if (!input.trim()) return;
    const next = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (e:any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) send();
  }
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">LangPath Demo</h1>
      <div className="border rounded p-3 h-72 overflow-y-auto bg-white">
        {messages.map((m,i)=>(
          <div key={i} className={`mb-2 ${m.role==="user"?"text-right":""}`}>
            <span className={`inline-block px-3 py-2 rounded ${m.role==="user"?"bg-purple-100":"bg-gray-100"}`}>{m.content}</span>
          </div>
        ))}
      </div>
      <textarea
        className="w-full border rounded p-2"
        rows={3}
        placeholder="Type here... (Ctrl/Cmd + Enter to send)"
        value={input}
        onChange={(e)=>setInput(e.target.value)}
        onKeyDown={onKey}
      />
      <div className="flex gap-2">
        <button onClick={send} disabled={loading} className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50">
          {loading ? "Sending..." : "Send"}
        </button>
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>
    </div>
  );
}
