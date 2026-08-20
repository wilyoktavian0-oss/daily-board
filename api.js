/* =========================================================
   api.js
   Modul khusus untuk komunikasi dengan API eksternal.
   Fungsi di sini murni mengambil data (fetch) dan melempar
   error jika gagal. Tidak menyentuh DOM sama sekali —
   urusan menampilkan hasil/errornya jadi tanggung jawab
   pemanggil (lihat script.js).
   ========================================================= */

// Kutipan harian (dummyjson.com/quotes/random dipakai karena
// api.quotable.io sudah lama down/tidak merespons).
export async function ambilKutipan() {
  const res = await fetch("https://dummyjson.com/quotes/random");
  if (!res.ok) throw new Error("Gagal mengambil kutipan");
  return res.json(); // { quote, author, ... }
}

// Cuaca harian via OpenWeatherMap.
// CATATAN KEAMANAN: API key ditulis langsung di kode (hardcoded) dan
// bisa dilihat siapa saja lewat DevTools/source. Untuk aplikasi
// sungguhan, panggil API ini lewat backend/serverless function sendiri
// supaya key tidak terekspos ke browser. Dibiarkan apa adanya di sini
// karena sepertinya masih tahap belajar/latihan.
export async function ambilCuaca(kota) {
  const apiKey = "5b6c0548c8330810a8b2ff20920aa4ad"; // ganti dengan API key OpenWeatherMap milikmu
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    kota
  )}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Kota tidak ditemukan");
  return res.json();
}
