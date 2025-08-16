import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE_URL = process.env.MODEL_BASE_URL || "https://api.sea-lion.ai/v1";
const MODEL_ID = process.env.MODEL_ID || "aisingapore/Llama-SEA-LION-v3-70B-IT";

// Do NOT force-cast here; collect keys and narrow at runtime for both safety and typing.
const KEY_1 = process.env.MODEL_API_KEY_1;
const KEY_2 = process.env.MODEL_API_KEY_2;

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
    const json = await req.json();
    const { messages, locale, country, noCache } = ReqSchema.parse(json);

    // Collect available keys and narrow to string[]
    const keys = [KEY_1, KEY_2].filter((k): k is string => Boolean(k));
    if (keys.length === 0) {
      return NextResponse.json(
        { error: "Missing MODEL_API_KEY_1 / MODEL_API_KEY_2 in environment." },
        { status: 500 }
      );
    }

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

    // Try each key in order, fallback on transient errors
    let lastStatus = 0;
    let lastText = "";

    for (let i = 0; i < keys.length; i++) {
      const res = await callSeaLion(body, keys[i], abort.signal);
      if (res.ok) {
        const data = await res.json();
        const reply = data?.choices?.[0]?.message?.content ?? "";
        return NextResponse.json({ reply });
      }
      lastStatus = res.status;
      lastText = await res.text().catch(() => "");
      // Backoff on rate-limit
      if (res.status === 429 && i < keys.length - 1) {
        await new Promise((r) => setTimeout(r, 800));
        continue;
      }
      // Retry next key on common transient errors
      if ([500, 502, 503, 504].includes(res.status) && i < keys.length - 1) continue;
      break;
    }

    return NextResponse.json(
      { error: `SEA-LION API error: ${lastStatus} ${lastText}` },
      { status: 502 }
    );
  } catch (err: any) {
    const msg =
      err?.name === "AbortError" ? "Upstream timeout" : err?.message || "Unknown server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  } finally {
    clearTimeout(timeout);
  }
}
