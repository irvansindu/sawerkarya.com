"use client";

import { FormEvent, useState } from "react";

export default function CheckoutTestPage() {
  const [productName, setProductName] = useState("Alight Motion");
  const [optionLabel, setOptionLabel] = useState("30 Hari");
  const [amount, setAmount] = useState(15000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, optionLabel, amount }),
      });

      const data = (await res.json()) as { checkoutUrl?: string; error?: string };

      if (!res.ok || !data.checkoutUrl) {
        setError(data.error || "Gagal membuat transaksi Tripay");
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
      <div className="w-full max-w-md bg-slate-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Tes Checkout Tripay</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm">Nama Produk</label>
            <input
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Opsi / Durasi</label>
            <input
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
              value={optionLabel}
              onChange={(e) => setOptionLabel(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Harga (Rp)</label>
            <input
              type="number"
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              min={1}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent text-black font-semibold py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Bayar dengan Tripay"}
          </button>
        </form>
      </div>
    </main>
  );
}
