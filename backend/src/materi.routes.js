import { Router } from "express";
import { semua, createMateri } from "./materi.repository.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await semua();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { judul, mataKuliah, pertemuan, tautan } = req.body;
    const cleanJudul = String(judul ?? "").trim();
    const cleanMataKuliah = String(mataKuliah ?? "").trim();
    const angkaPertemuan = Number(pertemuan);

    if (
      !cleanJudul ||
      !cleanMataKuliah ||
      !Number.isInteger(angkaPertemuan) ||
      angkaPertemuan < 1
    ) {
      return res.status(400).json({
        error: "Judul, mata kuliah, dan pertemuan (angka >= 1) wajib diisi",
      });
    }

    const created = await createMateri({
      judul: cleanJudul,
      mataKuliah: cleanMataKuliah,
      pertemuan: angkaPertemuan,
      tautan,
    });

    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
});

export default router;