import pool from "./db.js";

try {
  const [rows] = await pool.query("SELECT VERSION() AS versi, DATABASE() AS db, CURRENT_USER() AS pengguna");
  console.log("Koneksi berhasil:", rows[0]);
} catch (err) {
  console.error("Koneksi gagal:", err.code || err.message);
} finally {
  await pool.end();
}
