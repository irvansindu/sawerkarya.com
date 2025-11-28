"use client";

import { useEffect, useState } from "react";

type ProductOption = {
  label: string;
  displayPrice: string;
  amount: number;
};

type Product = {
  name: string;
  options: ProductOption[];
  features: string[];
  highlight?: boolean;
  stock?: number;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authed) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/products", {
          headers: { "x-admin-password": password },
        });
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const data = (await res.json()) as Product[];
        setProducts(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Gagal memuat produk");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authed, password]);

  const handleLogin = async () => {
    setAuthed(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify(products),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      alert("Produk tersimpan.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan produk");
    } finally {
      setSaving(false);
    }
  };

  if (!authed) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-sm text-brand-muted">Masukkan password admin untuk mengelola produk.</p>
        <input
          type="password"
          className="w-full rounded-md border border-white/20 bg-black/20 px-3 py-2"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={handleLogin}
          className="w-full rounded-full bg-accent px-5 py-2 font-semibold text-black hover:opacity-90 transition"
        >
          Masuk
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kelola Produk</h1>
          <p className="text-sm text-brand-muted">Edit nama, harga, opsi durasi, dan stok produk QINZ STORE.</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-accent px-5 py-2 font-semibold text-black hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </header>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {loading && <p className="text-sm text-brand-muted">Memuat produk...</p>}

      <div className="space-y-6">
        {products.map((p, idx) => (
          <div key={p.name + idx} className="rounded-2xl border border-white/15 bg-white/5 p-4 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <input
                className="w-full rounded-md bg-black/30 px-3 py-2 text-lg font-semibold"
                value={p.name}
                onChange={(e) => {
                  const next = [...products];
                  next[idx] = { ...next[idx], name: e.target.value };
                  setProducts(next);
                }}
              />
              <div className="flex items-center gap-3 text-sm">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={!!p.highlight}
                    onChange={(e) => {
                      const next = [...products];
                      next[idx] = { ...next[idx], highlight: e.target.checked };
                      setProducts(next);
                    }}
                  />
                  Highlight
                </label>
                <label className="flex items-center gap-1">
                  Stok:
                  <input
                    type="number"
                    className="w-20 rounded-md bg-black/40 px-2 py-1 text-right text-xs"
                    value={p.stock ?? 0}
                    onChange={(e) => {
                      const value = Number(e.target.value) || 0;
                      const next = [...products];
                      next[idx] = { ...next[idx], stock: value };
                      setProducts(next);
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase text-brand-muted">Opsi Durasi & Harga</p>
              <div className="space-y-2">
                {p.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex flex-wrap items-center gap-2">
                    <input
                      className="w-32 rounded-md bg-black/30 px-2 py-1 text-sm"
                      placeholder="Label"
                      value={opt.label}
                      onChange={(e) => {
                        const next = [...products];
                        next[idx].options[oIdx] = { ...opt, label: e.target.value };
                        setProducts(next);
                      }}
                    />
                    <input
                      className="w-32 rounded-md bg-black/30 px-2 py-1 text-sm"
                      placeholder="Harga tampilan"
                      value={opt.displayPrice}
                      onChange={(e) => {
                        const next = [...products];
                        next[idx].options[oIdx] = { ...opt, displayPrice: e.target.value };
                        setProducts(next);
                      }}
                    />
                    <input
                      type="number"
                      className="w-28 rounded-md bg-black/30 px-2 py-1 text-sm"
                      placeholder="Amount (IDR)"
                      value={opt.amount}
                      onChange={(e) => {
                        const value = Number(e.target.value) || 0;
                        const next = [...products];
                        next[idx].options[oIdx] = { ...opt, amount: value };
                        setProducts(next);
                      }}
                    />
                    <button
                      type="button"
                      className="text-xs text-red-400 hover:text-red-300"
                      onClick={() => {
                        const next = [...products];
                        next[idx].options.splice(oIdx, 1);
                        if (next[idx].options.length === 0) {
                          next[idx].options.push({ label: "Baru", displayPrice: "Rp0", amount: 0 });
                        }
                        setProducts(next);
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="rounded-full border border-white/20 px-3 py-1 text-xs text-brand-muted hover:bg-white/5"
                  onClick={() => {
                    const next = [...products];
                    next[idx].options.push({ label: "Baru", displayPrice: "Rp0", amount: 0 });
                    setProducts(next);
                  }}
                >
                  + Tambah Opsi
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase text-brand-muted">Fitur</p>
              {p.features.map((f, fIdx) => (
                <div key={fIdx} className="flex items-center gap-2">
                  <input
                    className="w-full rounded-md bg-black/30 px-2 py-1 text-sm"
                    value={f}
                    onChange={(e) => {
                      const next = [...products];
                      next[idx].features[fIdx] = e.target.value;
                      setProducts(next);
                    }}
                  />
                  <button
                    type="button"
                    className="text-xs text-red-400 hover:text-red-300"
                    onClick={() => {
                      const next = [...products];
                      next[idx].features.splice(fIdx, 1);
                      setProducts(next);
                    }}
                  >
                    Hapus
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="rounded-full border border-white/20 px-3 py-1 text-xs text-brand-muted hover:bg-white/5"
                onClick={() => {
                  const next = [...products];
                  next[idx].features.push("Fitur baru");
                  setProducts(next);
                }}
              >
                + Tambah Fitur
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
