"use client";

import { useMemo, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 5; // client-side cap mirrors server

export default function ChatDemo() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Halo! Ini demo ChatGPT versi terbatas. Kirim pertanyaanmu (maksimal beberapa pesan).",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const usedCount = useMemo(() => messages.filter((m) => m.role === "user").length, [messages]);
  const limitReached = usedCount >= MAX_MESSAGES;

  async function onSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || loading || limitReached) return;

    const userMsg: Msg = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("/api/chat-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Maaf, terjadi kesalahan: ${data?.error || "Unknown"}` },
        ]);
      } else {
        const assistant: Msg = { role: "assistant", content: data.content || "" };
        setMessages((prev) => [...prev, assistant]);
        if (typeof data?.remaining === "number") setRemaining(data.remaining);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Maaf, terjadi kesalahan jaringan." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 backdrop-blur p-4 space-y-4">
        <div className="text-sm text-zinc-400">
          Sesi demo dibatasi sekitar {MAX_MESSAGES} pesan per browser.
        </div>
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
              <div
                className={
                  "inline-block rounded-lg px-3 py-2 whitespace-pre-wrap " +
                  (m.role === "user"
                    ? "bg-accent text-black"
                    : "bg-zinc-900 text-zinc-100 border border-zinc-800")
                }
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={onSend} className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={limitReached ? "Batas demo tercapai" : "Tulis pesan..."}
            className="flex-1 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent/50"
            disabled={loading || limitReached}
          />
          <button
            type="submit"
            disabled={loading || limitReached}
            className="rounded-lg bg-accent text-black font-semibold px-4 py-2 disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim"}
          </button>
        </form>
        <div className="text-xs text-zinc-500">
          {limitReached
            ? "Batas pesan demo terpenuhi."
            : remaining !== null
            ? `Sisa kuota server: ${remaining}`
            : null}
        </div>
      </div>
    </div>
  );
}
