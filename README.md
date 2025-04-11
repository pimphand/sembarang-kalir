# Kalkulator Weton Jawa

Aplikasi web untuk menghitung weton Jawa menggunakan Nuxt.js dan AI.

## Fitur

- Perhitungan weton Jawa berdasarkan tanggal dan waktu lahir
- Integrasi dengan AI untuk memberikan penjelasan dan ramalan
- Antarmuka pengguna yang modern dan responsif

## Persyaratan

- Node.js (versi 14 atau lebih baru)
- npm atau yarn
- API key dari Hugging Face

## Instalasi

1. Clone repositori ini
2. Install dependencies:
```bash
npm install
```

3. Buat file `.env` dan tambahkan API key Hugging Face Anda:
```
HUGGING_FACE_API_KEY=your_api_key_here
```

4. Jalankan aplikasi dalam mode development:
```bash
npm run dev
```

5. Buka browser dan akses `http://localhost:3000`

## Cara Mendapatkan API Key

1. Daftar akun di [Hugging Face](https://huggingface.co/)
2. Buat token API baru di [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Salin token dan masukkan ke dalam file `.env`

## Penggunaan

1. Masukkan tanggal lahir
2. Masukkan waktu lahir
3. Klik tombol "Hitung Weton"
4. Tunggu hasil perhitungan dan penjelasan dari AI

## Teknologi yang Digunakan

- Nuxt.js 3
- Vue 3
- Tailwind CSS
- Hugging Face API
- Axios 