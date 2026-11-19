import express from "express";
import cors from "cors";
import materiRoutes from "./materi.routes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/api/sehat", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/materi", materiRoutes);

// Penanganan rute tidak dikenal (404)
app.use((req, res) => {
  res.status(404).json({ error: "Rute tidak ditemukan" });
});

// Penanganan error umum (500) - detail asli hanya di terminal
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Terjadi kesalahan pada server" });
});

app.listen(port, () => {
  console.log("Server berjalan di http://localhost:" + port);
});