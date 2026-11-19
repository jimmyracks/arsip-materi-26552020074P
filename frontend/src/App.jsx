import { useEffect, useState, useCallback } from "react";
import { ambilMateri } from "./api/materi.js";
import "./App.css";

export default function App() {
  const [materiList, setMateriList] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState("");

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

  return (
    <main className="container">
      <h1>Arsip Materi</h1>

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
