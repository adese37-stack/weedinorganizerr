# Luxury Beige & Gold Wedding Invitation

Undangan pernikahan digital statis yang ringan, responsif, dan siap dipublikasikan melalui GitHub Pages.

## Fitur

- Cover dengan nama tamu berdasarkan parameter URL.
- Tema Luxury Beige & Gold dan glassmorphism.
- Dark mode otomatis mengikuti perangkat serta tombol pengalih manual.
- Musik ambient original dengan efek fade-in/fade-out.
- Countdown waktu acara.
- Profil pasangan, detail acara, lokasi, kisah cinta, galeri, hadiah, RSVP, dan ucapan.
- RSVP tersimpan di `localStorage` pada perangkat pengunjung.
- Animasi ringan dengan `IntersectionObserver`.
- Aksesibilitas dasar dan dukungan `prefers-reduced-motion`.

## Cara Menjalankan

Karena proyek statis, Anda dapat:

1. Membuka `index.html` langsung di browser; atau
2. Menggunakan Live Server di VS Code agar seluruh fitur berjalan lebih konsisten.

## Mengubah Data Undangan

Buka:

`assets/js/config.js`

Ubah nama pasangan, tanggal, orang tua, akun Instagram, alamat, tautan Google Maps, kisah, dan rekening pada file tersebut.

## Mengganti Foto

Ganti file berikut dengan foto Anda sendiri. Nama file dapat tetap sama agar tidak perlu mengubah HTML:

- `assets/images/couple-hero.svg`
- `assets/images/bride.svg`
- `assets/images/groom.svg`
- `assets/images/gallery-1.svg` sampai `gallery-4.svg`
- `assets/images/closing.svg`

Format JPG, PNG, WEBP, atau AVIF juga dapat digunakan. Setelah mengganti ekstensi, sesuaikan alamatnya di `index.html`.

Rekomendasi:
- Hero: 1200 × 1500 px.
- Foto mempelai: 900 × 1200 px.
- Galeri: minimal 1200 px pada sisi terpanjang.
- Kompres ke WebP/AVIF untuk performa terbaik.

## Mengganti Musik

Ganti:

`assets/audio/wedding-song.mp3`

Anda juga dapat memakai MP3. Bila memakai MP3, ubah tag `<source>` di `index.html` menjadi:

```html
<source src="assets/audio/nama-lagu.mp3" type="audio/mpeg">
```

Pastikan Anda memiliki izin penggunaan musik tersebut.

## Nama Tamu dari URL

Gunakan parameter `to`, misalnya:

```text
https://username.github.io/nama-repository/?to=Kel+besar+Bpk.+Suwardi
```

Nama otomatis tampil pada cover dan kolom RSVP.

## Deploy ke GitHub Pages

1. Buat repository baru di GitHub.
2. Unggah seluruh isi folder proyek ke repository.
3. Buka **Settings → Pages**.
4. Pada bagian **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/root`.
6. Simpan dan tunggu sampai tautan GitHub Pages tersedia.

## RSVP Online Multi-Pengguna

Versi ini menggunakan `localStorage`, sehingga data hanya tersimpan di perangkat masing-masing pengunjung. Untuk RSVP terpusat, hubungkan form ke salah satu layanan berikut:

- Google Apps Script + Google Sheets
- Firebase Firestore
- Supabase
- Formspree

## Lisensi

Kode proyek ini dibuat original dan dapat Anda modifikasi untuk penggunaan pribadi. Foto, musik, logo, dan konten pihak ketiga harus digunakan sesuai lisensinya.


## Revisi Final

- Tanggal acara: 29 Desember 2026.
- Musik: menggunakan `assets/audio/wedding-song.mp3`.
- Foto: menggunakan seluruh foto yang diberikan pengguna dan sudah dikompresi ke WebP.
- Lokasi akad dan resepsi: menggunakan tautan Google Maps yang diberikan.
- Fitur tambahan: splash logo, efek mengetik nama tamu, timeline interaktif, lightbox dengan navigasi, peta tersemat, Google Calendar, dan konfeti ringan.
