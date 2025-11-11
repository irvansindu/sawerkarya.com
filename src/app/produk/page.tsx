import ElectricBorder from "../../components/ElectricBorder";

export default function ProdukPage() {
  const pricing = [
    {
      name: "ChatGPT Business Invite",
      price: "Rp10.000/bulan",
      features: [
        "Akses GPT-5",
        "Menggunakan Email Anda Sendiri",
        "Garansi 1 Bulan",
      ],
      highlight: false,
    },
    {
      name: "ChatGPT Plus Private",
      price: "Rp15.000/bulan",
      features: [
        "Akses GPT-5",
        "1 Akun 1 User",
        "Garansi 1 Bulan",
      ],
      highlight: true,
    },
    {
      name: "Head ChatGPT Business",
      price: "Rp45.000/bulan",
      features: [
        "Bisa Invite 5 Email/Orang",
        "Akses GPT-5",
        "Garansi 1 Bulan",
      ],
      highlight: false,
    },
  ];

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Pilih Paket Sesuai Kebutuhan</h1>
        <p className="text-brand-muted">Upgrade produktivitas Anda dengan paket yang fleksibel.</p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pricing.map((tier) => {
          const Card = (
            <div
              key={tier.name}
              className={`rounded-2xl border border-white/15 p-6 backdrop-blur bg-white/5 ${
                tier.highlight ? "ring-2 ring-accent" : ""
              }`}
            >
              <h3 className="text-xl font-semibold">{tier.name}</h3>
              <p className="mt-2 text-2xl font-bold text-accent">{tier.price}</p>
              <ul className="mt-4 grid gap-2 text-sm text-brand-muted">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={`https://wa.me/6289633011300?text=${encodeURIComponent(`Saya ingin membeli ${tier.name} (${tier.price})`)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block w-full rounded-full bg-accent px-5 py-3 text-center font-semibold text-black shadow hover:opacity-90 transition"
              >
                Beli
              </a>
            </div>
          );

          if (tier.name === "ChatGPT Plus Private") {
            return (
              <ElectricBorder key={tier.name} color="#22d3ee" chaos={1.1} speed={1.2} thickness={2}>
                {Card}
              </ElectricBorder>
            );
          }
          return Card;
        })}
      </div>

      <p className="text-xs text-brand-muted">
        Harga dapat berubah sewaktu-waktu. Pajak dapat berlaku sesuai regulasi setempat.
      </p>
    </div>
  );
}
