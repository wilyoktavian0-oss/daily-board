console.log("Script 1 loaded");

const app = document.getElementById("app");
const judul = document.createElement("h2");
judul.textContent = "Selamat datang di DailyBoard!";
app.appendChild(judul);
judul.id = "judul-app";


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


let daftarTugas = [
  { id: 1, nama: "Belajar JavaScript", selesai: false },
  { id: 2, nama: "Olahraga pagi", selesai: false },
];
let nextId = 3;
function tambahTugas(nama) {
  daftarTugas.push({ id: nextId++, nama, selesai: false });
  simpanKeStorage();
  renderTugas();
}

function hapusTugas(id) {
  daftarTugas = daftarTugas.filter((t) => t.id !== id);
  simpanKeStorage();
  renderTugas();
}


function toggleSelesai(id) {
  daftarTugas = daftarTugas.map((t) =>
    t.id === id ? { ...t, selesai: !t.selesai } : t
  );
  simpanKeStorage();
  renderTugas();
}

// Minggu 9 - Edit Data & Validasi Input
function editTugas(id, namaBaru) {
  daftarTugas = daftarTugas.map((t) =>
    t.id === id ? { ...t, nama: namaBaru } : t
  );
  simpanKeStorage();
  renderTugas();
}

function validasiInput(nilai) {
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

// Minggu 6 - Filter tugas + render (dengan drag-and-drop dari Minggu 13)
let filterAktif = "semua";

// FIX: tambah parameter opsional "overrideList" supaya bisa dipakai untuk
// menampilkan hasil pencarian (array custom) tanpa merusak logika filter biasa.
function renderTugas(filter = filterAktif, overrideList = null) {
  filterAktif = filter;
  const list = document.getElementById("daftar-tugas");
  list.innerHTML = "";

  const tugasTersaring =
    overrideList ||
    daftarTugas.filter((t) => {
      if (filter === "selesai") return t.selesai;
      if (filter === "belum") return !t.selesai;
      return true;
    });

  // FIX: fungsi hapusTugas duplikat di sini dihapus karena sudah ada
  // versi globalnya di atas (fungsi lokal ini menutupi/shadow yang global
  // dan cuma bikin bingung, tidak ada gunanya).

  tugasTersaring.forEach((tugas) => {
    const li = document.createElement("li");
    li.dataset.id = tugas.id;
    li.setAttribute("draggable", true);

    const nama = document.createElement("span");
    nama.className = "tugas-nama";
    nama.textContent = tugas.nama;
    nama.style.textDecoration = tugas.selesai ? "line-through" : "none";
    // klik untuk tandai selesai
    nama.addEventListener("click", () => toggleSelesai(tugas.id));
    // klik dua kali untuk edit (Minggu 9)
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

function buatSectionTugas() {
  const h2 = document.createElement("h2");
  h2.textContent = "Tugas";
  sectionTugas.appendChild(h2);

  // Form tambah tugas (Minggu 3 & Minggu 5)
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
  sectionTugas.appendChild(form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nilai = input.value;
    console.log("Nilai input:", nilai);
    if (!validasiInput(nilai)) return;
    tambahTugas(nilai.trim());
    input.value = "";
  });

  // Filter bar (Minggu 6)
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

  sectionTugas.appendChild(filterBar);

  // FIX: tambah search box di sini (elemen search-input aslinya tidak
  // pernah dibuat di HTML, jadi getElementById("search-input") selalu null
  // dan menyebabkan error). Sekarang dibuat langsung lewat JS.
  const searchWrapper = document.createElement("div");
  searchWrapper.className = "search-bar";
  const searchInputEl = document.createElement("input");
  searchInputEl.id = "search-input";
  searchInputEl.placeholder = "Cari tugas...";
  searchWrapper.appendChild(searchInputEl);
  sectionTugas.appendChild(searchWrapper);

  const ul = document.createElement("ul");
  ul.id = "daftar-tugas";
  sectionTugas.appendChild(ul);
}

/* =========================================================
   FASE 3: LocalStorage & Fitur Catatan (Minggu 7-9)
   ========================================================= */

// Minggu 7 - Menyimpan & memuat data tugas
function simpanKeStorage() {
  localStorage.setItem("daftarTugas", JSON.stringify(daftarTugas));
}

function muatDariStorage() {
  const data = localStorage.getItem("daftarTugas");
  daftarTugas = data ? JSON.parse(data) : daftarTugas;
  if (daftarTugas.length) {
    nextId = Math.max(...daftarTugas.map((t) => t.id)) + 1;
  }
}

// Minggu 8 - Fitur Catatan Cepat (Notes)
// FIX: data awal sebelumnya salah bentuk (copy-paste dari struktur tugas:
// field "isi" berisi angka, ada field "nama"/"selesai" yang tidak relevan
// untuk catatan). Catatan sebenarnya diisi dari localStorage lewat
// muatCatatanDariStorage(), jadi cukup mulai dari array kosong.
let daftarCatatan = [];

// FIX: hapus parameter "isi" yang tidak dipakai (menyesatkan, seolah fungsi
// butuh argumen padahal dia menyimpan seluruh daftarCatatan).
function simpanCatatanKeStorage() {
  localStorage.setItem("daftarCatatan", JSON.stringify(daftarCatatan));
}

function muatCatatanDariStorage() {
  const data = localStorage.getItem("daftarCatatan");
  daftarCatatan = data ? JSON.parse(data) : [];
}

function tambahCatatan(isi) {
  daftarCatatan.push({
    id: Date.now(),
    isi,
    tanggal: new Date().toLocaleDateString(),
  });
  simpanCatatanKeStorage();
  renderCatatan();
}

function renderCatatan() {
  const container = document.getElementById("daftar-catatan");
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

    // FIX: fitur hapus catatan ditambahkan di sini. Fungsi hapusCatatan()
    // sudah ada sejak awal tapi tidak pernah dipanggil dari mana pun
    // karena belum ada tombolnya di tampilan.
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

function buatSectionCatatan() {
  const h2 = document.createElement("h2");
  h2.textContent = "Catatan";
  sectionCatatan.appendChild(h2);

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
  sectionCatatan.appendChild(form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nilai = textarea.value;
    if (!validasiInput(nilai)) return;
    tambahCatatan(nilai.trim());
    textarea.value = "";
  });

  const container = document.createElement("div");
  container.id = "daftar-catatan";
  sectionCatatan.appendChild(container);
}

// FIX: parameter diganti dari "isi" ke "id" karena fungsi ini menghapus
// berdasarkan id, bukan isi teksnya. Sebelumnya variabel "id" dipakai di
// dalam fungsi tanpa pernah didefinisikan (ReferenceError kalau dipanggil).
function hapusCatatan(id) {
  daftarCatatan = daftarCatatan.filter((c) => c.id !== id);
  simpanCatatanKeStorage();
  renderCatatan();
}

// FIX: sama seperti di atas, parameter pertama diganti jadi "id" biar
// konsisten dan benar-benar terdefinisi saat dipakai di c.id === id.
function editCatatan(id, isiBaru) {
  daftarCatatan = daftarCatatan.map((c) =>
    c.id === id ? { ...c, isi: isiBaru } : c
  );
  simpanCatatanKeStorage();
  renderCatatan();
}

/* =========================================================
   FASE 4: Integrasi API (Minggu 10-12)
   ========================================================= */

// Minggu 11 - Widget Kutipan Hari Ini
// FIX: api.quotable.io sudah lama down/mati total (server tidak merespons
// sama sekali, banyak laporan serupa di repo GitHub-nya), makanya widget
// kutipan selalu gagal dan menampilkan "Gagal mengambil kutipan.".
// Diganti ke dummyjson.com/quotes/random yang masih aktif, gratis, dan
// tidak butuh API key.
async function ambilKutipan() {
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    if (!res.ok) throw new Error("Gagal mengambil kutipan");
    const data = await res.json();
    document.getElementById("kutipan-harian").textContent =
      `"${data.quote}" — ${data.author}`;
  } catch (error) {
    document.getElementById("kutipan-harian").textContent =
      "Gagal mengambil kutipan.";
    console.error("Gagal mengambil kutipan:", error);
  }
}

// Minggu 11 - Widget Cuaca dengan API
// CATATAN KEAMANAN: API key OpenWeatherMap ditulis langsung di kode
// (hardcoded) dan bisa dilihat siapa saja yang buka DevTools/source.
// Untuk aplikasi sungguhan, panggil API cuaca lewat backend/serverless
// function sendiri supaya key tidak terekspos ke browser. Dibiarkan apa
// adanya di sini karena sepertinya masih tahap belajar/latihan.
async function ambilCuaca(kota) {
  const apiKey = "5b6c0548c8330810a8b2ff20920aa4ad"; // ganti dengan API key OpenWeatherMap milikmu
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${kota}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Kota tidak ditemukan");
    const data = await res.json();

    const infoCuaca = document.getElementById("info-cuaca");
    infoCuaca.innerHTML = `<p>Cuaca di ${data.name}: ${data.main.temp}&deg;C</p>
      <p>${data.weather[0].description}</p>`;
  } catch (error) {
    const infoCuaca = document.getElementById("info-cuaca");
    infoCuaca.textContent = error.message;
  }
}

// Minggu 12 - Menggabungkan Beberapa Sumber Data
async function muatSemuaWidget() {
  document.getElementById("status").textContent = "Memuat data...";
  await Promise.all([ambilKutipan(), ambilCuaca("soreang")]);
  document.getElementById("status").textContent = "Data berhasil dimuat";
}

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
    ambilKutipan().then(() => {
      status.textContent = "Kutipan berhasil diperbarui";
    });
  });
  sectionKutipan.appendChild(tombolRefresh);
}

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
    ambilCuaca(kota);
  });

  const infoCuaca = document.createElement("div");
  infoCuaca.id = "info-cuaca";
  sectionCuaca.appendChild(infoCuaca);
}

/* =========================================================
   FASE 5: Fitur Lanjutan (Minggu 13-14)
   ========================================================= */

// Minggu 13 - Drag and Drop untuk Urutan Tugas
function aktifkanDragDrop() {
  const items = document.querySelectorAll(".tugas-item, #daftar-tugas li");

  items.forEach((item) => {
    item.setAttribute("draggable", true);

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

// logika mengubah urutan array daftarTugas dan menyimpannya
function pindahkanUrutanTugas(idAsal, idTujuan) {
  if (idAsal === idTujuan) return;

  const indexAsal = daftarTugas.findIndex((t) => String(t.id) === idAsal);
  const indexTujuan = daftarTugas.findIndex((t) => String(t.id) === idTujuan);
  if (indexAsal === -1 || indexTujuan === -1) return;

  const [tugasDipindah] = daftarTugas.splice(indexAsal, 1);
  daftarTugas.splice(indexTujuan, 0, tugasDipindah);

  simpanKeStorage();
  renderTugas();

}

// Minggu 13 (tambahan) - Drag and Drop untuk Urutan Catatan
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
  const indexTujuan = daftarCatatan.findIndex((c) => String(c.id) === idTujuan);
  if (indexAsal === -1 || indexTujuan === -1) return;

  const [catatanDipindah] = daftarCatatan.splice(indexAsal, 1);
  daftarCatatan.splice(indexTujuan, 0, catatanDipindah);

  simpanCatatanKeStorage();
  renderCatatan();
}


/* =========================================================
   Inisialisasi Aplikasi
   ========================================================= */

function initApp() {
  muatDariStorage();
  muatCatatanDariStorage();

  buatSectionTugas();
  buatSectionCatatan();
  buatSectionKutipan();
  buatSectionCuaca();

  renderTugas();
  renderCatatan();

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const kataKunci = e.target.value.toLowerCase();
      const hasil = daftarTugas.filter((t) =>
        t.nama.toLowerCase().includes(kataKunci)
      );
      renderTugas(filterAktif, hasil);
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  initApp();
  muatSemuaWidget();
});
const toggleTema = document.getElementById("dark-mode-toggle"); 

if (toggleTema) {
  toggleTema.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const modeAktif = document.body.classList.contains("dark-mode");
    localStorage.setItem("modeTema", modeAktif ? "dark" : "light");
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const modeTema = localStorage.getItem("modeTema");
  if (modeTema === "dark") {
    document.body.classList.add("dark-mode");
  }
});