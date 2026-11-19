import { useEffect, useState, useCallback } from "react";
import { ambilMateri } from "./api/materi.js";
import "./App.css";

export default function App() {
  const [materiList, setMateriList] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState("");
  const [judul, setJudul] = useState("");
  const [hasilTerakhir, setHasilTerakhir] = useState(null);
const [mataKuliah, setMataKuliah] = useState("");
const [pertemuan, setPertemuan] = useState("");
const [tautan, setTautan] = useState("");
const [pesan, setPesan] = useState("");
const [menyimpan, setMenyimpan] = useState(false);
  const muatData = useCallback(async () => {
    setMemuat(true);
    setGalat("");
    try {
      const data = await ambilMateri();
      setMateriList(Array.isArray(data) ? data : []);
    } catch (err) {
      setGalat(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data.");
    } finally {
      setMemuat(false);
    }
  }, []);

  useEffect(() => {
    muatData();
  }, [muatData]);
 async function handleTambahMateri(e) {
  e.preventDefault();
  setPesan("");
  setMenyimpan(true);

  try {
    const res = await fetch("http://localhost:3000/api/materi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        judul,
        mataKuliah,
        pertemuan: Number(pertemuan),
        tautan: tautan.trim() || null,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setPesan(data.error || "Gagal menyimpan materi");
      return;
    }

    setJudul("");
    setMataKuliah("");
    setPertemuan("");
    setTautan("");
    setPesan("Materi berhasil disimpan ke database.");
    await muatData();
  } catch {
    setPesan("Terjadi kesalahan saat menghubungi server");
  } finally {
    setMenyimpan(false);
  }
}
  return (
    <main className="container">
      <h1>Arsip Materi</h1>
      <form onSubmit={handleTambahMateri}>
  <input
    type="text"
    placeholder="Judul materi"
    value={judul}
    onChange={(e) => setJudul(e.target.value)}
    required
  />
  <input
    type="text"
    placeholder="Mata kuliah"
    value={mataKuliah}
    onChange={(e) => setMataKuliah(e.target.value)}
    required
  />
  <input
    type="number"
    placeholder="Pertemuan"
    min="1"
    value={pertemuan}
    onChange={(e) => setPertemuan(e.target.value)}
    required
  />
  <input
    type="url"
    placeholder="Tautan (opsional)"
    value={tautan}
    onChange={(e) => setTautan(e.target.value)}
  />
  <button type="submit" disabled={menyimpan}>
    {menyimpan ? "Menyimpan..." : "Simpan Materi"}
  </button>
</form>
{pesan && <p>{pesan}</p>}

      {memuat && <p>Memuat...</p>}

      {!memuat && galat && (
        <div role="alert">
          <p>{galat}</p>
          <button type="button" onClick={muatData}>
            Coba lagi
          </button>
        </div>
      )}

      {!memuat && !galat && materiList.length === 0 && (
        <p>Belum ada materi</p>
      )}

      {!memuat && !galat && materiList.length > 0 && (
        <ul>
          {materiList.map((item) => (
            <li key={item.id}>
              <strong>{item.judul}</strong> — {item.mataKuliah} (Pertemuan {item.pertemuan})
              {item.tautan ? (
                <>
                  {" "}
                  —{" "}
                  <a href={item.tautan} target="_blank" rel="noreferrer">
                    Buka Tautan
                  </a>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
