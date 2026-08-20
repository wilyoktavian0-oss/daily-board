/* =========================================================
   storage.js
   Modul khusus untuk baca/tulis localStorage.
   Tidak ada logika bisnis atau manipulasi DOM di sini.
   ========================================================= */

const KEY_TUGAS = "daftarTugas";
const KEY_CATATAN = "daftarCatatan";
const KEY_TEMA = "modeTema";

export function simpanTugas(daftarTugas) {
  localStorage.setItem(KEY_TUGAS, JSON.stringify(daftarTugas));
}

// Mengembalikan array jika ada data tersimpan, atau null jika belum ada.
export function muatTugas() {
  const data = localStorage.getItem(KEY_TUGAS);
  return data ? JSON.parse(data) : null;
}

export function simpanCatatan(daftarCatatan) {
  localStorage.setItem(KEY_CATATAN, JSON.stringify(daftarCatatan));
}

export function muatCatatan() {
  const data = localStorage.getItem(KEY_CATATAN);
  return data ? JSON.parse(data) : null;
}

export function simpanTema(mode) {
  localStorage.setItem(KEY_TEMA, mode);
}

export function muatTema() {
  return localStorage.getItem(KEY_TEMA);
}
