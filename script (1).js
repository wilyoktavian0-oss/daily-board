/* =========================================================
   script.js
   Entry point aplikasi DailyBoard. Membangun skeleton DOM lalu
   mendelegasikan tiap fitur ke modulnya masing-masing:
   - tugas.js    -> fitur Tugas
   - catatan.js  -> fitur Catatan
   - api.js      -> fetch kutipan & cuaca
   - storage.js  -> baca/tulis localStorage
   ========================================================= */

import { initTugas } from "./tugas.js";
import { initCatatan } from "./catatan.js";
import { ambilKutipan, ambilCuaca } from "./api.js";
import { validasiInput } from "./tugas.js";
import { simpanTema, muatTema } from "./storage.js";

console.log("Script utama dimuat");

const app = document.getElementById("app");

const judul = document.createElement("h2");
judul.id = "judul-app";
judul.textContent = "Selamat datang di DailyBoard!";
app.appendChild(judul);

const sectionTugas = document.createElement("section");
sectionTugas.id = "section-tugas";
const sectionCatatan = document.createElement("section");
sectionCatatan.id = "section-catatan";
const sectionKutipan = document.createElement("section");
sectionKutipan.id = "section-kutipan";
const sectionCuaca = document.createElement("section");
sectionCuaca.id = "section-cuaca";

app.appendChild(sectionTugas);
app.appendChild(sectionCatatan);
app.appendChild(sectionKutipan);
app.appendChild(sectionCuaca);

/* ---------- Widget Kutipan ---------- */

function buatSectionKutipan() {
  const h2 = document.createElement("h2");
  h2.textContent = "Kutipan Hari Ini";
  sectionKutipan.appendChild(h2);

  const status = document.createElement("p");
  status.id = "status";
  sectionKutipan.appendChild(status);

  const kutipan = document.createElement("p");
  kutipan.id = "kutipan-harian";
  sectionKutipan.appendChild(kutipan);

  const tombolRefresh = document.createElement("button");
  tombolRefresh.id = "refresh-kutipan";
  tombolRefresh.textContent = "Refresh Kutipan";
  tombolRefresh.addEventListener("click", () => {
    status.textContent = "Memuat kutipan...";
    perbaruiKutipan().then(() => {
      status.textContent = "Kutipan berhasil diperbarui";
    });
  });
  sectionKutipan.appendChild(tombolRefresh);
}

async function perbaruiKutipan() {
  const kutipanEl = document.getElementById("kutipan-harian");
  try {
    const data = await ambilKutipan();
    kutipanEl.textContent = `"${data.quote}" — ${data.author}`;
  } catch (error) {
    kutipanEl.textContent = "Gagal mengambil kutipan.";
    console.error("Gagal mengambil kutipan:", error);
  }
}

/* ---------- Widget Cuaca ---------- */

function buatSectionCuaca() {
  const h2 = document.createElement("h2");
  h2.textContent = "Cuaca Hari Ini";
  sectionCuaca.appendChild(h2);

  const form = document.createElement("form");
  form.className = "inline-form";

  const inputKota = document.createElement("input");
  inputKota.id = "input-kota";
  inputKota.placeholder = "Nama kota...";

  const tombolCek = document.createElement("button");
  tombolCek.type = "submit";
  tombolCek.textContent = "Cek Cuaca";

  form.appendChild(inputKota);
  form.appendChild(tombolCek);
  sectionCuaca.appendChild(form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const kota = inputKota.value.trim();
    if (!validasiInput(kota)) return;
    document.getElementById("info-cuaca").textContent = "Memuat...";
    perbaruiCuaca(kota);
  });

  const infoCuaca = document.createElement("div");
  infoCuaca.id = "info-cuaca";
  sectionCuaca.appendChild(infoCuaca);
}

async function perbaruiCuaca(kota) {
  const infoCuaca = document.getElementById("info-cuaca");
  try {
    const data = await ambilCuaca(kota);
    infoCuaca.innerHTML = `<p>Cuaca di ${data.name}: ${data.main.temp}&deg;C</p>
      <p>${data.weather[0].description}</p>`;
  } catch (error) {
    infoCuaca.textContent = error.message;
  }
}

async function muatSemuaWidget() {
  document.getElementById("status").textContent = "Memuat data...";
  await Promise.all([perbaruiKutipan(), perbaruiCuaca("soreang")]);
  document.getElementById("status").textContent = "Data berhasil dimuat";
}

/* ---------- Dark Mode ---------- */

function terapkanTemaTersimpan() {
  if (muatTema() === "dark") {
    document.body.classList.add("dark-mode");
  }
}

function aktifkanToggleTema() {
  const toggleTema = document.getElementById("dark-mode-toggle");
  if (!toggleTema) return;
  toggleTema.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const modeAktif = document.body.classList.contains("dark-mode");
    simpanTema(modeAktif ? "dark" : "light");
  });
}

/* ---------- Inisialisasi Aplikasi ---------- */

function initApp() {
  initTugas(sectionTugas);
  initCatatan(sectionCatatan);
  buatSectionKutipan();
  buatSectionCuaca();
}

window.addEventListener("DOMContentLoaded", () => {
  terapkanTemaTersimpan();
  aktifkanToggleTema();
  initApp();
  muatSemuaWidget();
});
