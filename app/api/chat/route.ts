import { NextResponse } from "next/server";

const BASE_URL = process.env.MODEL_BASE_URL || "https://api.sea-lion.ai/v1";
const MODEL_ID = process.env.MODEL_ID || "aisingapore/Llama-SEA-LION-v3-70B-IT";
const KEY_1 = process.env.MODEL_API_KEY_1;
const KEY_2 = process.env.MODEL_API_KEY_2;

async function callSeaLion(body: unknown, apiKey: string) {
  return fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "accept": "text/plain"
    },
    body: JSON.stringify(body),
  });
}

export async function POST(req: Request) {
  try {
    const { messages, locale = "zh", noCache = false } = await req.json();

    const systemPrompt = [
      "You are LangPath, a multilingual mentor for youths in Southeast Asia.",
      "Be culturally sensitive (SEA context), supportive, and non-prescriptive.",
      "Always reply in the user's language.",
      "Ask for country/age/interests before recommending scholarships.",
      "No legal/medical/financial advice; provide general guidance."
    ].join(" ");

    const body = {
      model: MODEL_ID,
      messages: [
        { role: "system", content: systemPrompt },
        ...(Array.isArray(messages) ? messages : [])
      ],
      temperature: 0.3,
      stream: false,
      ...(noCache ? { cache: { "no-cache": true } } : {})
    };

    let res = await callSeaLion(body, KEY_1 || "");
    if ([401, 403, 429].includes(res.status) && KEY_2) {
      res = await callSeaLion(body, KEY_2);
    }
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `SEA-LION API error: ${res.status} ${text}` },
        { status: 500 }
      );
    }
    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unknown server error" },
      { status: 500 }
    );
  }
}