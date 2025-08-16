import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE_URL = process.env.MODEL_BASE_URL || "https://api.sea-lion.ai/v1";
// You can override via .env.local -> MODEL_ID
const MODEL_ID = process.env.MODEL_ID || "aisingapore/Llama-SEA-LION-v3-70B-IT";
const KEY_1 = process.env.MODEL_API_KEY_1;
const KEY_2 = process.env.MODEL_API_KEY_2;

// Request validator
const ReqSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1),
  locale: z.string().optional().default("zh"),
  country: z.string().optional().default("Singapore"),
  noCache: z.boolean().optional().default(false),
});

async function callSeaLion(body: unknown, apiKey: string, signal?: AbortSignal) {
  return fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
    signal,
  });
}

export async function POST(req: Request) {
  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), 30_000);

  try {
    // Parse and validate
    const json = await req.json();
    const { messages, locale, country, noCache } = ReqSchema.parse(json);

    // Single system prompt for all use cases (chat, reco, plan)
    const systemPrompt = [
      "You are LangPath, a multilingual mentor for youths in Southeast Asia.",
      "Always reply in the user's language and be culturally sensitive within the SEA context.",
      "Ask for country/age/interests if missing before recommending scholarships/opportunities.",
      "Provide general guidance only. No legal/medical/financial advice.",
      `User preferred locale: ${locale}. User country: ${country}.`,
    ].join(" ");

    const body = {
      model: MODEL_ID,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.3,
      stream: false,
      ...(noCache ? { cache: { "no-cache": true } } : {}),
    };

    // Primary call
    let res = await callSeaLion(body, KEY_1, abort.signal);

    // Fallback on common transient errors
    if ([401, 403, 429, 500, 502, 503, 504].includes(res.status) && KEY_2) {
      if (res.status === 429) await new Promise((r) => setTimeout(r, 800));
      res = await callSeaLion(body, KEY_2, abort.signal);
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `SEA-LION API error: ${res.status} ${text}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ reply });
  } catch (err: any) {
    const msg =
      err?.name === "AbortError" ? "Upstream timeout" : err?.message || "Unknown server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  } finally {
    clearTimeout(timeout);
  }
}
