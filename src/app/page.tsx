import Image from "next/image";
import Link from "next/link";
import TrueFocus from "../components/TrueFocus";
import SplashCursorWebGL from "../components/SplashCursorWebGL";

export default function Home() {
  return (
    <div className="grid gap-14">
      <SplashCursorWebGL />
      <section className="grid items-center gap-8 py-10 sm:grid-cols-2 relative z-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Image src="/fivan-logo-2.png" alt="Fivan Store" width={32} height={32} className="h-8 w-8 object-contain" />
            <span className="text-sm text-brand-muted">Fivan Store</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Distributor <TrueFocus sentence="Chat GPT" /> — Solusi AI untuk Produktivitas Anda.
          </h1>
          <p className="text-brand-muted text-lg">
            Akses premium, paket penggunaan fleksibel, dan konsultasi berbasis AI untuk mempercepat pekerjaan, menulis lebih cepat, dan memicu ide kreatif.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/produk" className="rounded-full bg-accent px-6 py-3 text-black font-semibold shadow hover:opacity-90 transition">
              Beli Sekarang
            </Link>
            <Link href="/demo" className="rounded-full border border-white/20 px-6 py-3 font-semibold hover:bg-white/5 transition">
              Coba Demo
            </Link>
          </div>
          <div className="grid gap-3 text-sm text-brand-muted">
            <div className="flex items-start gap-3"><span>⚡</span><span>Otomatisasi tugas berulang untuk menghemat waktu</span></div>
            <div className="flex items-start gap-3"><span>✍️</span><span>Penulisan cepat untuk email, dokumen, dan konten</span></div>
            <div className="flex items-start gap-3"><span>💡</span><span>Ide kreatif untuk strategi, riset, dan perencanaan</span></div>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-64 sm:w-80">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/30 via-transparent to-accent/10 blur-2xl" />
          <div className="relative grid h-full place-items-center rounded-3xl border border-white/15 bg-white/5 backdrop-blur">
            <Image
              src="/fivan-logo-2.png"
              alt="Fivan Store"
              width={256}
              height={256}
              className="max-h-[70%] max-w-[70%] object-contain"
              priority
              unoptimized
            />
          </div>
        </div>
      </section>
    </div>
  );
}

