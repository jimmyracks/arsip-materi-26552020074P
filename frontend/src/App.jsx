import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3000/api/materi";

function App() {
  const [materiList, setMateriList] = useState([]);
  const [judul, setJudul] = useState("");
  const [mataKuliah, setMataKuliah] = useState("");
  const [pertemuan, setPertemuan] = useState("");
  const [tautan, setTautan] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pesan, setPesan] = useState("");
  const [error, setError] = useState("");

  async function ambilMateri() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_URL);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Gagal memuat data materi (HTTP ${res.status})`);
      }

      const list = Array.isArray(data) ? data : data.data || [];
      setMateriList(list);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    ambilMateri();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setPesan("");
    setError("");

    const angkaBersih = String(pertemuan).replace(/\D/g, "");
    const pertemuanAngka = angkaBersih ? Number(angkaBersih) : NaN;

    if (
      !judul.trim() ||
      !mataKuliah.trim() ||
      !Number.isInteger(pertemuanAngka) ||
      pertemuanAngka < 1
    ) {
      setError("Judul, mata kuliah, dan pertemuan (angka >= 1) wajib diisi");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          judul: judul.trim(),
          mataKuliah: mataKuliah.trim(),
          pertemuan: pertemuanAngka,
          tautan: tautan.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Terjadi kesalahan pada server");
      }

      setJudul("");
      setMataKuliah("");
      setPertemuan("");
      setTautan("");
      setPesan("Materi berhasil disimpan ke database.");
      await ambilMateri();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan pada server");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-bg">
      <div className="container">
        <h1 className="brand-title">ArsipMateri</h1>

        <div className="form-card">
          <h2 className="card-heading">Tambah Materi Baru</h2>

          <form className="materi-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-input"
              placeholder="Judul Materi"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
            />

            <input
              type="text"
              className="form-input"
              placeholder="Mata Kuliah"
              value={mataKuliah}
              onChange={(e) => setMataKuliah(e.target.value)}
            />

            <input
              type="text"
              inputMode="numeric"
              className="form-input"
              placeholder="Pertemuan (cth: Pertemuan 3)"
              value={pertemuan}
              onChange={(e) => setPertemuan(e.target.value)}
            />

            <input
              type="text"
              className="form-input"
              placeholder="Link URL"
              value={tautan}
              onChange={(e) => setTautan(e.target.value)}
            />

            <button type="submit" className="btn-simpan" disabled={submitting}>
              {submitting ? "Menyimpan..." : "Simpan Materi"}
            </button>
          </form>

          {pesan && <p className="status-ok">{pesan}</p>}
          {error && <p className="status-err">{error}</p>}
        </div>

        <hr className="divider" />

        <section className="list-section">
          <h2 className="list-heading">Daftar Materi</h2>

          {loading ? (
            <p className="list-muted">Memuat data materi...</p>
          ) : materiList.length === 0 ? (
            <p className="list-muted">Belum ada materi tersimpan.</p>
          ) : (
            <div className="materi-stack">
              {materiList.map((item, idx) => {
                const linkUrl = item.tautan || item.link_url || "";
                return (
                  <article key={item.id ?? idx} className="materi-item">
                    <h3 className="materi-judul">{item.judul}</h3>
                    <p className="materi-meta">
                      Mata Kuliah: {item.mata_kuliah ?? item.mataKuliah}
                    </p>
                    <p className="materi-meta">Pertemuan {item.pertemuan}</p>
                    {linkUrl && (
                      <a
                        href={linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="buka-materi"
                      >
                        Buka Materi
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;