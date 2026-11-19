import { pool } from "./db.js";

export async function semua() {
  const [rows] = await pool.query(
    "SELECT id, judul, mata_kuliah, pertemuan, tautan, dibuat FROM materi ORDER BY id ASC"
  );

  return rows.map((row) => ({
    id: row.id,
    judul: row.judul,
    mataKuliah: row.mata_kuliah,
    pertemuan: row.pertemuan,
    tautan: row.tautan ?? null,
    dibuat: row.dibuat,
  }));
}

export async function createMateri({ judul, mataKuliah, pertemuan, tautan }) {
  const cleanJudul = String(judul ?? "").trim();
  const cleanMataKuliah = String(mataKuliah ?? "").trim();
  const cleanTautan =
    typeof tautan === "string" && tautan.trim() !== "" ? tautan.trim() : null;

  const [result] = await pool.execute(
    "INSERT INTO materi (judul, mata_kuliah, pertemuan, tautan) VALUES (?, ?, ?, ?)",
    [cleanJudul, cleanMataKuliah, Number(pertemuan), cleanTautan]
  );

  const [rows] = await pool.execute(
    "SELECT id, judul, mata_kuliah, pertemuan, tautan, dibuat FROM materi WHERE id = ?",
    [result.insertId]
  );

  const row = rows[0];
  return {
    id: row.id,
    judul: row.judul,
    mataKuliah: row.mata_kuliah,
    pertemuan: row.pertemuan,
    tautan: row.tautan ?? null,
    dibuat: row.dibuat,
  };
}