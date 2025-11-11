"use client";

import { useState } from "react";

export default function KontakPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [pesan, setPesan] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("Pertanyaan dari website Distributor Chat GPT");
    const body = encodeURIComponent(`Nama: ${nama}\nEmail: ${email}\n\n${pesan}`);
    window.location.href = `mailto:irvansindu653@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Kontak</h1>
        <p className="text-brand-muted">Tinggalkan pesan Anda atau hubungi kami via WhatsApp.</p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
        <div className="grid gap-2">
          <label htmlFor="nama" className="text-sm">Nama</label>
          <input id="nama" value={nama} onChange={(e) => setNama(e.target.value)}
            required
            className="rounded-md border border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-md border border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="pesan" className="text-sm">Pesan</label>
          <textarea id="pesan" value={pesan} onChange={(e) => setPesan(e.target.value)}
            rows={5}
            className="rounded-md border border-white/20 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-accent" />
        </div>
        <button type="submit" className="rounded-full bg-accent px-6 py-3 font-semibold text-black shadow hover:opacity-90 transition">
          Kirim via Email
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <a className="rounded-full border border-white/20 px-4 py-2 hover:bg-white/5 transition" href="https://wa.me/6289633011300" target="_blank" rel="noreferrer">WhatsApp</a>
        <a className="rounded-full border border-white/20 px-4 py-2 hover:bg-white/5 transition" href="mailto:irvansindu653@gmail.com">irvansindu653@gmail.com</a>
      </div>
    </div>
  );
}
