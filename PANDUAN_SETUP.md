# Panduan Setup — Portal PIBG SK Alor Janggus

Portal komunikasi PIBG–sekolah (PWA). Backend Google Sheets, login ID+PIN untuk waris dan kata laluan tunggal untuk admin. Admin boleh urus data dalam app **atau** terus di Google Sheets (sesuai untuk daftar ramai murid sekaligus).

---

## RINGKASAN FAIL
- `index.html` — aplikasi (frontend). Ada suis MOD demo/live.
- `Code.gs` — backend Google Apps Script.
- `manifest.json`, `sw.js` — sokongan PWA (boleh "install" ke telefon).
- `DEMO_portal_pibg.html` — versi demo berdiri sendiri (tiada backend), untuk tunjuk cara.

---

## BAHAGIAN A — Backend (Google Sheets + Apps Script)

**1. Buat Google Sheet baharu**
- Pergi ke [sheets.new](https://sheets.new) — namakan cth: `Data PIBG SKAJ`

**2. Buka editor skrip**
- Menu **Extensions → Apps Script**
- Padam kod sedia ada, tampal SEMUA isi `Code.gs`

**3. Tetapkan kata laluan admin**
- Di bahagian atas `Code.gs`, cari `const ADMIN_PIN = 'adminpibg';`
- Tukar `'adminpibg'` kepada kata laluan pilihan anda

**4. Bina tab + data contoh (sekali sahaja)**
- Pilih fungsi `setupSheets` pada menu dropdown atas
- Klik **Run** ▶ — benarkan kebenaran (authorize)
- Kembali ke Sheet — 8 tab terbina automatik dengan data contoh

**5. Deploy sebagai Web App**
- **Deploy → New deployment** → gear ⚙ → **Web app**
- **Execute as:** Me · **Who has access:** Anyone
- **Deploy** → salin **Web app URL** (`https://script.google.com/macros/s/XXXX/exec`)

---

## BAHAGIAN B — Frontend

**6. Sambung app ke backend**
Buka `index.html`, di bahagian atas skrip:
```js
const MOD = 'demo';   // tukar ke 'live'
const API_URL = 'GANTI_DENGAN_URL_WEB_APP_GAS';   // tampal URL Web App
```
- Tukar `MOD` kepada `'live'`
- Tampal URL Web App ke `API_URL`

**7. Hos di GitHub Pages**
- Repo baharu → muat naik `index.html`, `manifest.json`, `sw.js`
- Settings → Pages → branch `main`
- Portal hidup di `https://username.github.io/nama-repo/`

---

## CARA GUNA

### Waris
Buka link → masuk **ID pengguna + kata laluan**. Boleh "Add to Home Screen".
Modul: Notis, Kalendar, Kewangan, AJK, Galeri, Bank Soalan, Maklum Balas.

### Admin (dua cara kemas kini)

**Cara 1 — dalam app:** login guna ID `9999` + kata laluan admin. Tambah/edit/padam Notis, Kalendar, Kewangan, AJK, Murid, Bank Soalan, dan balas Maklum Balas. Sesuai untuk suntingan cepat.

**Cara 2 — terus di Google Sheet:** buka Sheet, edit mana-mana tab. **Sesuai untuk daftar ramai murid** — salin-tampal beratus baris dari Excel terus ke tab `Pelajar`. Jangan sentuh kolum `RowID` (biarkan kosong untuk baris baharu — sistem akan jana sendiri bila perlu; atau isi nilai unik anda sendiri).

---

## STRUKTUR TAB SHEET

| Tab | Kolum |
|-----|-------|
| Notis | RowID, Tarikh, Tajuk, Kandungan, LampiranURL |
| Kalendar | RowID, Tarikh, Acara, Lokasi |
| Kewangan | RowID, Tarikh, Jenis (Kutipan/Perbelanjaan), Perkara, Jumlah |
| AJK | RowID, Nama, Jawatan, Telefon, Foto |
| Pelajar | RowID, ID, PIN, NamaPelajar, Kelas, NamaPenjaga |
| Latihan | RowID, Tajuk, Subjek, Darjah, Ikon, Keterangan, URL |
| Galeri | RowID, Tajuk, Tarikh, AlbumURL (pautan album Google Photos) |
| MaklumBalas | RowID, idWaris, nama, kelas, kategori, soalan, masa, jawapan |

**Pendaftaran ramai (tab Pelajar):** lajur `ID` bebas (nombor atau huruf) tetapi mesti unik, `PIN` 6 digit. `Kelas` cth "4 Bestari" (sistem guna nombor darjah untuk auto-tapis Bank Soalan).

---

## NOTA PENTING
- **Login ringkas** sesuai untuk maklumat am PIBG. Elak data sensitif (markah peribadi, no IC penuh).
- Setiap kali ubah `Code.gs`: **Deploy → Manage deployments → Edit → New version**.
- Lampiran/gambar: muat naik ke Google Drive (set "Anyone with link"), guna format pautan `https://drive.google.com/uc?export=view&id=FILEID`.
- Tukar `MOD` kembali ke `'demo'` bila-bila untuk tunjuk cara tanpa menyentuh data sebenar.

---

## CADANGAN FASA SETERUSNYA
- Notifikasi push bila ada notis/jawapan baharu
- Modul yuran peribadi per anak (perlu login lebih ketat)
- Eksport laporan kewangan PDF
- Berbilang admin dengan log tindakan
