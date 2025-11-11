import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Distributor Chat GPT",
  description: "Platform penjualan layanan ChatGPT: akses premium, paket penggunaan, dan konsultasi berbasis AI.",
  metadataBase: new URL("https://www.sawerkarya.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Distributor Chat GPT",
    description:
      "Platform penjualan layanan ChatGPT: akses premium, paket penggunaan, dan konsultasi berbasis AI.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/fivan-logo-2.png", type: "image/png", rel: "icon", sizes: "32x32" },
      { url: "/fivan-logo-2.png", type: "image/png", rel: "icon", sizes: "16x16" },
    ],
    shortcut: "/fivan-logo-2.png",
    apple: "/fivan-logo-2.png",
  },
  other: {
    "theme-color": "#0b1e39",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased bg-brand text-brand-foreground"
      >
        <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-brand/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <Image
                src="/fivan-logo-2.png"
                alt="Fivan Store"
                width={28}
                height={28}
                className="h-7 w-7 rounded-md object-contain"
                priority
                key="logo-v2"
              />
              <span>Distributor Chat GPT</span>
            </Link>
            <nav className="hidden gap-6 text-sm sm:flex">
              <Link className="hover:text-accent transition-colors" href="/">Beranda</Link>
              <Link className="hover:text-accent transition-colors" href="/produk">Produk</Link>
              <Link className="hover:text-accent transition-colors" href="/tentang">Tentang</Link>
              <Link className="hover:text-accent transition-colors" href="/kontak">Kontak</Link>
              <Link className="hover:text-accent transition-colors" href="/demo">Coba Demo</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/produk"
                className="rounded-full bg-accent px-4 py-2 text-black font-medium shadow hover:opacity-90 transition"
              >
                Beli Sekarang
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto min-h-[calc(100vh-160px)] w-full max-w-6xl px-6 py-10">{children}</main>
        <footer className="border-t border-white/10 bg-brand/90">
          <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-brand-muted">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p>
                {new Date().getFullYear()} Distributor Chat GPT. Semua hak cipta dilindungi.
              </p>
              <div className="flex items-center gap-5">
                <Link className="hover:text-accent" href="/tos">Ketentuan Layanan</Link>
                <Link className="hover:text-accent" href="/privasi">Kebijakan Privasi</Link>
                <a className="hover:text-accent" href="https://wa.me/6289633011300" target="_blank" rel="noreferrer">WhatsApp</a>
                <a className="hover:text-accent" href="mailto:irvansindu653@gmail.com">Email</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
