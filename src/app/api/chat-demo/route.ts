import { NextRequest, NextResponse } from "next/server";

// Server-side cap per browser via cookie; client will also cap for UX
const MAX_MESSAGES = 5;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server missing OPENAI_API_KEY. Add it to .env.local and restart the dev server." },
        { status: 500 }
      );
    }

    const cookie = req.cookies.get("demo_msg_count");
    const current = cookie ? parseInt(cookie.value || "0", 10) || 0 : 0;
    if (current >= MAX_MESSAGES) {
      return NextResponse.json(
        { error: `Demo limit reached. Maksimal ${MAX_MESSAGES} pesan.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const messages = (body?.messages || []) as Array<{ role: string; content: string }>;
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Body invalid: messages[] diperlukan" }, { status: 400 });
    }

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return NextResponse.json({ error: `OpenAI error: ${err}` }, { status: resp.status });
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content ?? "";

    const nextCount = Math.min(current + 1, MAX_MESSAGES);
    const res = NextResponse.json({ content, remaining: Math.max(0, MAX_MESSAGES - nextCount) });
    res.cookies.set("demo_msg_count", String(nextCount), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour window
      path: "/",
    });
    return res;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unexpected server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
