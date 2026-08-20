/* =========================================================
   catatan.js
   Modul untuk fitur Catatan Cepat: state, render, tambah/hapus,
   dan drag-and-drop urutan catatan.
   ========================================================= */

import { simpanCatatan, muatCatatan } from "./storage.js";
import { validasiInput } from "./tugas.js";

let daftarCatatan = [];

function muatDariStorage() {
  daftarCatatan = muatCatatan() || [];
}

function tambahCatatan(isi) {
  daftarCatatan.push({
    id: Date.now(),
    isi,
    tanggal: new Date().toLocaleDateString(),
  });
  simpanCatatan(daftarCatatan);
  renderCatatan();
}

function hapusCatatan(id) {
  daftarCatatan = daftarCatatan.filter((c) => c.id !== id);
  simpanCatatan(daftarCatatan);
  renderCatatan();
}

// Belum dipanggil dari UI mana pun (sama seperti kode aslinya), tapi
// tetap disediakan untuk dipakai bila fitur edit catatan ditambahkan nanti.
function editCatatan(id, isiBaru) {
  daftarCatatan = daftarCatatan.map((c) =>
    c.id === id ? { ...c, isi: isiBaru } : c
  );
  simpanCatatan(daftarCatatan);
  renderCatatan();
}

function renderCatatan() {
  const container = document.getElementById("daftar-catatan");
  if (!container) return;
  container.innerHTML = "";

  daftarCatatan.forEach((catatan) => {
    const div = document.createElement("div");
    div.className = "catatan-item";
    div.dataset.id = catatan.id;
    div.setAttribute("draggable", true);

    const isi = document.createElement("p");
    isi.textContent = catatan.isi;

    const tanggal = document.createElement("small");
    tanggal.textContent = catatan.tanggal;

    const aksi = document.createElement("div");
    aksi.className = "catatan-actions";

    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    tombolHapus.addEventListener("click", () => hapusCatatan(catatan.id));

    aksi.appendChild(tombolHapus);

    div.appendChild(isi);
    div.appendChild(tanggal);
    div.appendChild(aksi);
    container.appendChild(div);
  });

  aktifkanDragDropCatatan();
}

function aktifkanDragDropCatatan() {
  const items = document.querySelectorAll(".catatan-item");

  items.forEach((item) => {
    item.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", item.dataset.id);
    });

    item.addEventListener("dragover", (e) => {
      e.preventDefault();
      item.classList.add("drag-over");
    });

    item.addEventListener("dragleave", () => {
      item.classList.remove("drag-over");
    });

    item.addEventListener("drop", (e) => {
      e.preventDefault();
      item.classList.remove("drag-over");
      const idAsal = e.dataTransfer.getData("text/plain");
      const idTujuan = item.dataset.id;
      pindahkanUrutanCatatan(idAsal, idTujuan);
    });
  });
}

function pindahkanUrutanCatatan(idAsal, idTujuan) {
  if (idAsal === idTujuan) return;

  const indexAsal = daftarCatatan.findIndex((c) => String(c.id) === idAsal);
  const indexTujuan = daftarCatatan.findIndex(
    (c) => String(c.id) === idTujuan
  );
  if (indexAsal === -1 || indexTujuan === -1) return;

  const [catatanDipindah] = daftarCatatan.splice(indexAsal, 1);
  daftarCatatan.splice(indexTujuan, 0, catatanDipindah);

  simpanCatatan(daftarCatatan);
  renderCatatan();
}

function buatSectionCatatan(container) {
  const h2 = document.createElement("h2");
  h2.textContent = "Catatan";
  container.appendChild(h2);

  const form = document.createElement("form");
  form.className = "inline-form";

  const textarea = document.createElement("textarea");
  textarea.id = "input-catatan";
  textarea.placeholder = "Tulis catatan cepat...";
  textarea.rows = 2;

  const tombolSimpan = document.createElement("button");
  tombolSimpan.type = "submit";
  tombolSimpan.textContent = "Simpan Catatan";

  form.appendChild(textarea);
  form.appendChild(tombolSimpan);
  container.appendChild(form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nilai = textarea.value;
    if (!validasiInput(nilai)) return;
    tambahCatatan(nilai.trim());
    textarea.value = "";
  });

  const wadah = document.createElement("div");
  wadah.id = "daftar-catatan";
  container.appendChild(wadah);
}

// Titik masuk modul ini: dipanggil dari script.js dengan elemen <section>
// tempat UI catatan akan dibangun.
export function initCatatan(container) {
  muatDariStorage();
  buatSectionCatatan(container);
  renderCatatan();
}
