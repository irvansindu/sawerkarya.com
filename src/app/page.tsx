import Image from "next/image";
import Link from "next/link";
import TrueFocus from "../components/TrueFocus";

export default function Home() {
	return (
		<div className="grid gap-14">
			<section className="flex flex-col items-center gap-8 py-10 sm:py-14 relative z-10 max-w-3xl mx-auto">
				<div className="space-y-6 w-full text-center">
					<div className="flex items-center justify-center gap-3">
						<Image src="/fivan-logo-2.png" alt="QINZ STORE" width={32} height={32} className="h-8 w-8 object-contain" />
						<span className="text-sm text-brand-muted">QINZ STORE</span>
					</div>
					<h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
						<TrueFocus sentence="QINZ STORE" /> SUPPLIER APLIKASI PREMIUM TERMURAH.
					</h1>
					<p className="text-brand-muted text-lg">
						Toko digital untuk langganan aplikasi premium: streaming, musik, AI, produktivitas, dan hiburan dengan harga terjangkau dan bergaransi.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Link
							href="/produk"
							className="rounded-full bg-accent px-6 py-3 text-black font-semibold shadow hover:opacity-90 transition"
						>
							Beli Sekarang
						</Link>
						<Link
							href="/tentang"
							className="rounded-full border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/5 transition"
						>
							Learn More
						</Link>
					</div>
					<div className="grid gap-3 text-sm text-brand-muted justify-items-center">
						<div className="flex items-start gap-3 max-w-xl text-left"><span>⚡</span><span>Otomatisasi tugas berulang untuk menghemat waktu</span></div>
						<div className="flex items-start gap-3 max-w-xl text-left"><span>✍️</span><span>Penulisan cepat untuk email, dokumen, dan konten</span></div>
						<div className="flex items-start gap-3 max-w-xl text-left"><span>💡</span><span>Ide kreatif untuk strategi, riset, dan perencanaan</span></div>
					</div>
				</div>
			</section>
    </div>
  );
}
