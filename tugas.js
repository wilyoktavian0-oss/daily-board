/* =========================================================
   tugas.js
   Modul untuk fitur Tugas: state, render, tambah/hapus/edit,
   filter, pencarian, dan drag-and-drop urutan tugas.
   ========================================================= */

import { simpanTugas, muatTugas } from "./storage.js";

// State modul (private terhadap file ini, tidak bocor ke luar)
let daftarTugas = [
  { id: 1, nama: "Belajar JavaScript", selesai: false },
  { id: 2, nama: "Olahraga pagi", selesai: false },
];
let nextId = 3;
let filterAktif = "semua";

// Dipakai juga oleh catatan.js dan script.js (form cuaca), makanya diexport.
export function validasiInput(nilai) {
  if (nilai.trim() === "") {
    alert("Input tidak boleh kosong!");
    return false;
  }
  if (nilai.length > 100) {
    alert("Input maksimal 100 karakter!");
    return false;
  }
  return true;
}

function muatDariStorage() {
  const data = muatTugas();
  daftarTugas = data ? data : daftarTugas;
  if (daftarTugas.length) {
    nextId = Math.max(...daftarTugas.map((t) => t.id)) + 1;
  }
}

function tambahTugas(nama) {
  daftarTugas.push({ id: nextId++, nama, selesai: false });
  simpanTugas(daftarTugas);
  renderTugas();
}

function hapusTugas(id) {
  daftarTugas = daftarTugas.filter((t) => t.id !== id);
  simpanTugas(daftarTugas);
  renderTugas();
}

function toggleSelesai(id) {
  daftarTugas = daftarTugas.map((t) =>
    t.id === id ? { ...t, selesai: !t.selesai } : t
  );
  simpanTugas(daftarTugas);
  renderTugas();
}

function editTugas(id, namaBaru) {
  daftarTugas = daftarTugas.map((t) =>
    t.id === id ? { ...t, nama: namaBaru } : t
  );
  simpanTugas(daftarTugas);
  renderTugas();
}

// overrideList dipakai untuk menampilkan hasil pencarian (array custom)
// tanpa merusak logika filter biasa.
function renderTugas(filter = filterAktif, overrideList = null) {
  filterAktif = filter;
  const list = document.getElementById("daftar-tugas");
  if (!list) return;
  list.innerHTML = "";

  const tugasTersaring =
    overrideList ||
    daftarTugas.filter((t) => {
      if (filter === "selesai") return t.selesai;
      if (filter === "belum") return !t.selesai;
      return true;
    });

  tugasTersaring.forEach((tugas) => {
    const li = document.createElement("li");
    li.dataset.id = tugas.id;
    li.setAttribute("draggable", true);

    const nama = document.createElement("span");
    nama.className = "tugas-nama";
    nama.textContent = tugas.nama;
    nama.style.textDecoration = tugas.selesai ? "line-through" : "none";
    nama.addEventListener("click", () => toggleSelesai(tugas.id));
    nama.addEventListener("dblclick", () => {
      const namaBaru = prompt("Ubah nama tugas:", tugas.nama);
      if (namaBaru !== null && validasiInput(namaBaru)) {
        editTugas(tugas.id, namaBaru.trim());
      }
    });

    const aksi = document.createElement("div");
    aksi.className = "tugas-actions";

    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    tombolHapus.addEventListener("click", () => hapusTugas(tugas.id));

    aksi.appendChild(tombolHapus);
    li.appendChild(nama);
    li.appendChild(aksi);
    list.appendChild(li);
  });

  aktifkanDragDrop();
}

function aktifkanDragDrop() {
  const items = document.querySelectorAll("#daftar-tugas li");

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
      pindahkanUrutanTugas(idAsal, idTujuan);
    });
  });
}

function pindahkanUrutanTugas(idAsal, idTujuan) {
  if (idAsal === idTujuan) return;

  const indexAsal = daftarTugas.findIndex((t) => String(t.id) === idAsal);
  const indexTujuan = daftarTugas.findIndex((t) => String(t.id) === idTujuan);
  if (indexAsal === -1 || indexTujuan === -1) return;

  const [tugasDipindah] = daftarTugas.splice(indexAsal, 1);
  daftarTugas.splice(indexTujuan, 0, tugasDipindah);

  simpanTugas(daftarTugas);
  renderTugas();
}

function cariTugas(kataKunci) {
  const hasil = daftarTugas.filter((t) =>
    t.nama.toLowerCase().includes(kataKunci.toLowerCase())
  );
  renderTugas(filterAktif, hasil);
}

function buatSectionTugas(container) {
  const h2 = document.createElement("h2");
  h2.textContent = "Tugas";
  container.appendChild(h2);

  // Form tambah tugas
  const form = document.createElement("form");
  form.className = "inline-form";

  const input = document.createElement("input");
  input.id = "input-tugas";
  input.placeholder = "Nama tugas baru...";

  const tombolTambah = document.createElement("button");
  tombolTambah.type = "submit";
  tombolTambah.textContent = "Tambah";

  form.appendChild(input);
  form.appendChild(tombolTambah);
  container.appendChild(form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nilai = input.value;
    if (!validasiInput(nilai)) return;
    tambahTugas(nilai.trim());
    input.value = "";
  });

  // Filter bar
  const filterBar = document.createElement("div");
  filterBar.className = "filter-bar";

  const filters = [
    { label: "Semua", value: "semua" },
    { label: "Selesai", value: "selesai" },
    { label: "Belum Selesai", value: "belum" },
  ];

  filters.forEach((f) => {
    const btn = document.createElement("button");
    btn.textContent = f.label;
    btn.className = "secondary" + (f.value === "semua" ? " active" : "");
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-bar button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderTugas(f.value);
    });
    filterBar.appendChild(btn);
  });

  container.appendChild(filterBar);

  // Kotak pencarian
  const searchWrapper = document.createElement("div");
  searchWrapper.className = "search-bar";
  const searchInputEl = document.createElement("input");
  searchInputEl.id = "search-input";
  searchInputEl.placeholder = "Cari tugas...";
  searchInputEl.addEventListener("input", (e) => {
    cariTugas(e.target.value);
  });
  searchWrapper.appendChild(searchInputEl);
  container.appendChild(searchWrapper);

  const ul = document.createElement("ul");
  ul.id = "daftar-tugas";
  container.appendChild(ul);
}

// Titik masuk modul ini: dipanggil dari script.js dengan elemen <section>
// tempat UI tugas akan dibangun.
export function initTugas(container) {
  muatDariStorage();
  buatSectionTugas(container);
  renderTugas();
}
