import ChatDemo from "../../components/ChatDemo";

export default function DemoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Coba Demo</h1>
      <p className="text-brand-muted">Coba ChatGPT versi demo (dibatasi beberapa pesan).</p>
      <ChatDemo />
      <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur">
        <p className="text-sm text-brand-muted">Contoh prompt:</p>
        <ul className="mt-2 grid gap-2 text-sm">
          <li className="rounded-md border border-white/10 bg-white/5 px-3 py-2">Tulis email follow-up untuk calon klien.</li>
          <li className="rounded-md border border-white/10 bg-white/5 px-3 py-2">Buat ringkasan dokumen 2 halaman menjadi 5 poin.</li>
          <li className="rounded-md border border-white/10 bg-white/5 px-3 py-2">Berikan 10 ide konten media sosial untuk brand kopi.</li>
        </ul>
      </div>
    </div>
  );
}
