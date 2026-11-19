export async function ambilMateri() {
  const baseUrl = import.meta.env.VITE_API_URL;

  if (!baseUrl) {
    throw new Error("Konfigurasi VITE_API_URL belum diatur.");
  }

  let response;
  try {
    response = await fetch(`${baseUrl}/materi`);
  } catch {
    throw new Error("Gagal terhubung ke server API. Periksa koneksi jaringan atau server backend.");
  }

  if (!response.ok) {
    throw new Error(`Gagal memuat data materi (HTTP ${response.status}).`);
  }

  return response.json();
}
