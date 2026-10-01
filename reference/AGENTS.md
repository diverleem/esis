<!-- BEGIN:nextjs-agent-rules -->
# 1. Konteks project

Project ini merupakan skripsi S1 Teknik Informatika yang akan saya kerjakan, judul aplikasinya E.S.I.S (Electronic Smoking Identification System). Konsepnya, skripsi ini merupakan sistem untuk mendeteksi aktivitas merokok di lingkungan Pusat Lab Terpadu (PLT), khususnya laboratorium komputer melalui kamera CCTV yang streamingnya dapat diakses dalam website. Kemudian terdapat AI untuk mendeteksi aktivitas merokok, dan AI untuk mengenali wajah pelaku sehingga surat peringatan dapat diterbitkan oleh sistem. Project ini hanya berfokus kepada pengembangan website dan bagian AI sudah ada dibuat oleh rekan saya di skripsi lain sehingga, sekali lagi fokus utama dari skripsi ini adalah pengembangan web aplikasi monitoring aktivitas merokok.

Sistem ini mengintegrasikan:

* CCTV melalui streaming kamera RTSP yang diubah ke WebRTC dengan MediaMTX
* Raspberry Pi 5 sebagai streaming server, karena CCTV di lab PLT hanya dapat diakses lewat LAN pada switch dengan IP address khusus (172.20.32.<...>)
* Next.js sebagai bahasa pemrograman utama dari project ini
* Vercel sebagai tempat untuk deploy dari project ini
* Supabase sebagai basis data untuk project ini
* Computer Vision yang telah dikembangkan oleh rekan saya sebelumnya. *Untuk saat ini, fokus hanya di pengembangan web terlebih dahulu*
* Sistem pencatatan pelanggaran
* Sistem notifikasi

Tujuan utama sistem adalah menyediakan platform bagi administrator untuk mengelola dan memantau CCTV serta menerima informasi mengenai pelanggaran merokok yang terdeteksi oleh sistem Computer Vision.

# 2. Arsitektur Sistem

Arsitektur sistem harus mempertahankan pemisahan tanggung jawab antara web server, streaming server, AI server, dan database.

Secara umum alur sistem adalah:

```text
Streaming Server
CCTV
  |
  | RTSP
  v
MediaMTX (berjalan di Raspberry Pi 5)
  |
  | WebRTC (Port TCP <8889> dan Port UDP <8189>)
  v
Pinggy CLI (berjalan di Raspberry Pi 5)
  |
  |
  v
stream.ucim.my.id/nama_kamera


AI Server (Belum masuk fokus saat ini)
  |
  | Mengambil stream
  | Melakukan Computer Vision
  v
Backend / API
  |
  v
Supabase
  |
  v
Data Pelanggaran
  |
  v
Notifikasi

Web Server (Vercel)
  |
  |
  v
Internet
  |
  |
  V
Supabase / Streaming Server / AI Server
```

Pemisahan komponen harus dipertahankan selama tidak ada alasan teknis yang kuat untuk mengubahnya.

# 3. Tanggung Jawab Setiap Komponen

## 3.1 CCTV

1. CCTV merupakan sumber video sistem.
2. CCTV menyediakan stream menggunakan protokol RTSP.
3. Web browser tidak boleh mengakses RTSP secara langsung.
4. RTSP harus diproses terlebih dahulu oleh streaming server melalui program MediaMTX.
5. CCTV hanya bisa diakses lewat switch dengan alamat IP LAN 172.20.32.<...>
6. Link RTSP CCTV akan ditunneling oleh Streaming Server agar dapat diakses melalui URL `stream.ucim.my.id/nama_kamera`.

## 3.2 MediaMTX

MediaMTX digunakan sebagai streaming server. Tanggung jawab MediaMTX meliputi:

* menerima stream RTSP
* mengelola path stream
* menyediakan WebRTC
* menyediakan HLS jika diperlukan
* mendistribusikan stream kepada client

MediaMTX tidak boleh digantikan dengan Next.js untuk menangani RTSP.

## 3.3 Raspberry Pi 5

Raspberry Pi 5 digunakan sebagai streaming server atau bagian dari infrastruktur streaming. Tanggung jawab utama Raspberry Pi adalah:

* menjalankan MediaMTX
* mengelola stream CCTV
* menjalankan service pendukung yang diperlukan (Pinggy CLI)
* menyediakan stream kepada web application
* Jangan menjalankan proses Computer Vision yang berat pada Raspberry Pi
* Raspberry Pi harus diperlakukan sebagai perangkat dengan sumber daya terbatas.

## 3.4 Web Application

Web application menggunakan Next.js. Tanggung jawab web application meliputi:

* autentikasi
* otorisasi
* dashboard administrator
* pengelolaan CCTV
* monitoring CCTV
* menampilkan stream WebRTC atau HLS
* menampilkan data pelanggaran
* mengelola informasi kamera
* menyediakan antarmuka administrator

Web application tidak melakukan proses Computer Vision. *Mungkin untuk saat ini*

## 3.5 AI Server (kita kerjakan nanti jika sudah saya berikan perintah untuk mengerjakan bagian ini)

AI server bertanggung jawab terhadap proses Computer Vision. Tanggung jawabnya meliputi:

* mengambil stream CCTV
* mengambil frame
* melakukan inference
* mendeteksi indikasi pelanggaran merokok
* menentukan confidence
* menghasilkan informasi deteksi
* mengirimkan hasil deteksi ke backend

AI server harus dipisahkan secara logis dari frontend Next.js.

## 3.6 Supabase

Supabase digunakan sebagai database utama aplikasi. Data yang dapat disimpan antara lain:

* data streaming kamera
* data pengguna
* data mahasiswa beserta identitasnya
* data history pelanggaran

Credential yang memiliki hak akses tinggi tidak boleh dikirim ke browser.

# 4. Teknologi Utama

Teknologi utama proyek:

* Next.js
* React
* JavaScript atau TypeScript
* Supabase
* MediaMTX
* Raspberry Pi 5
* WebRTC
* HLS
* RTSP
* Python untuk service AI

Jangan menambahkan framework atau library baru jika tidak diperlukan.

Utamakan implementasi yang sederhana dan mudah dipahami daripada arsitektur yang terlalu kompleks.

# 5. Aturan Next.js

Next.js digunakan sebagai framework utama web application.

Sebelum membuat file atau folder baru:

1. Periksa struktur project.
2. Periksa apakah fungsi yang dibutuhkan sudah tersedia.
3. Gunakan kembali komponen atau fungsi yang sudah ada jika memungkinkan.
4. Hindari membuat abstraksi yang tidak diperlukan.

Jangan mengubah arsitektur project secara besar-besaran hanya untuk mengimplementasikan satu fitur.

# 6. Aturan Komponen

Setiap component harus memiliki tanggung jawab yang jelas.

Contoh struktur yang dapat digunakan:

```text
components/
├── camera/
├── dashboard/
├── violation/
├── layout/
└── ui/
```

Struktur tersebut hanya digunakan jika sesuai dengan project yang sudah ada.

Jangan membuat component baru untuk bagian kode yang sangat kecil jika tidak memberikan manfaat terhadap keterbacaan atau penggunaan ulang.

# 7. Aturan State Management

Gunakan state management sesederhana mungkin.

Gunakan React state untuk state yang hanya digunakan oleh satu component.

Jangan menambahkan Redux atau library state management lain kecuali benar-benar diperlukan.

Jangan membuat global state untuk data yang sebenarnya hanya digunakan pada satu halaman atau component.

# 8. Fitur Tambah dan Hapus CCTV

Administrator harus dapat menambahkan dan menghapus CCTV.

Alur umum:

```text
Administrator
      |
      v
Next.js
      |
      v
API / Backend
      |
      v
MediaMTX
      |
      v
RTSP Camera
```

Penambahan CCTV tidak boleh mengharuskan developer mengubah source code frontend.

Penghapusan CCTV harus menangani konfigurasi stream terkait.

Jangan meninggalkan path MediaMTX yang sudah tidak digunakan setelah kamera dihapus.

# 9. Aturan API (Nanti dikerjakan saat diperintahkan)

API harus memiliki tanggung jawab yang jelas.

Contoh:

```text
GET    /api/cameras
POST   /api/cameras
DELETE /api/cameras/:id

GET    /api/violations
POST   /api/violations
```

Endpoint tidak boleh melakukan banyak fungsi yang tidak berkaitan.

Semua input dari user harus divalidasi.

Jangan mempercayai input seperti:

```text
rtsp_url
camera_id
confidence
student_id
```

tanpa validasi.

Gunakan HTTP status code yang sesuai.

API harus menangani kondisi error secara eksplisit.

# 10. Keamanan Supabase

Credential dengan hak akses tinggi tidak boleh dikirim ke browser.

Jangan pernah memasukkan:

```text
SUPABASE_SERVICE_ROLE_KEY
```

ke dalam kode frontend.

Jangan memasukkan secret ke repository Git.

# 11. Integrasi AI (dikerjakan saat waktunya)

AI harus diperlakukan sebagai service yang terpisah.

Web application tidak melakukan inference.

Alur umum:

```text
CCTV
  |
  v
MediaMTX
  |
  v
AI Server
  |
  | Deteksi
  v
Backend / API
  |
  v
Supabase
  |
  v
Data Pelanggaran
```

Hasil deteksi dapat memiliki informasi seperti:

```text
camera_id
timestamp
class
confidence
snapshot
```

Sistem tidak boleh menyimpan setiap frame sebagai pelanggaran.

Harus terdapat mekanisme untuk menghindari duplikasi pelanggaran akibat deteksi berulang pada frame yang berdekatan.

# 12. MediaMTX Control API

Jika MediaMTX Control API digunakan untuk mengelola stream:

```text
Web Application
      |
      v
Backend
      |
      v
MediaMTX Control API
      |
      v
Stream Configuration
```

Frontend tidak boleh langsung mengekspos credential Control API.

Operasi seperti menambahkan atau menghapus path harus dilakukan melalui backend atau service yang memiliki hak akses sesuai.

# 13. Status CCTV

Frontend harus dapat membedakan setidaknya:

```text
Loading
Connected
Disconnected
Error
```

CCTV yang mengalami error tidak boleh menyebabkan seluruh dashboard gagal.

Status harus ditampilkan secara jelas kepada administrator.

# 14. Error Handling

Semua operasi jaringan harus memiliki error handling.

Termasuk:

* request API
* koneksi Supabase
* koneksi MediaMTX
* koneksi WebRTC
* koneksi HLS
* pengambilan stream
* proses AI

Pesan error kepada user harus mudah dipahami.

Jangan menampilkan secret, stack trace internal, atau informasi sensitif kepada user.

# 15. Aturan UI dan UX

Interface harus mengutamakan kejelasan.

Dashboard harus tetap dapat digunakan ketika beberapa CCTV ditampilkan secara bersamaan.

Status kamera harus mudah dikenali.

Gunakan istilah yang konsisten.

Untuk interface administrator kampus gunakan bahasa Indonesia kecuali terdapat kebutuhan khusus untuk menggunakan bahasa Inggris.

Hindari animasi yang tidak diperlukan.

Hindari visual effect yang tidak memiliki fungsi terhadap usability.

# 16. Aturan Kode

Utamakan kode yang:

* mudah dibaca
* mudah diuji
* mudah dijelaskan
* mudah dipelihara

Gunakan nama variable dan function yang deskriptif.

Hindari nama seperti:

```text
x
data2
temp
foo
bar
```

jika terdapat nama yang lebih jelas.

Hindari duplikasi business logic.

Jangan melakukan refactoring besar ketika hanya diminta memperbaiki satu fitur.

# 17. Aturan Perubahan Kode

Sebelum mengubah kode:

1. Baca kode yang berkaitan.
2. Pahami alur data.
3. Identifikasi dependensi.
4. Tentukan perubahan minimal yang diperlukan.
5. Implementasikan perubahan.
6. Periksa error.
7. Uji fungsi yang terdampak.

Jangan mengubah file yang tidak berkaitan dengan tugas.

Jangan mengganti implementasi yang sudah berjalan hanya karena terdapat pendekatan lain yang terlihat lebih modern.

# 18. Aturan Debugging

Ketika terjadi error:

1. Reproduksi error.
2. Identifikasi lokasi error.
3. Tentukan apakah error berasal dari frontend, backend, database, MediaMTX, jaringan, atau AI.
4. Periksa log yang relevan.
5. Perbaiki penyebab utama.
6. Uji kembali.
7. Pastikan perbaikan tidak merusak fungsi lain.

Jangan langsung melakukan rewrite terhadap sistem hanya karena terdapat satu error.

# 19. Aturan Khusus Skripsi

Implementasi harus tetap sesuai dengan ruang lingkup skripsi.

Sistem merupakan prototype penelitian tingkat sarjana.

Jangan membuat arsitektur yang terlalu kompleks tanpa kebutuhan penelitian.

Setiap fitur utama harus memiliki hubungan yang jelas dengan tujuan sistem.

Implementasi harus dapat dijelaskan secara akademis pada saat sidang.

Keputusan teknis harus dapat dijelaskan berdasarkan:

* kebutuhan sistem
* arsitektur
* alur data
* implementasi
* keamanan
* performa
* usability
* pengujian

Jangan menambahkan fitur hanya karena fitur tersebut terlihat menarik tetapi tidak memiliki hubungan dengan tujuan penelitian.

# 20. Aturan Klaim Hasil

Agent tidak boleh mengarang:

* hasil pengujian
* nilai akurasi
* nilai precision
* nilai recall
* nilai F1-score
* nilai latency
* FPS
* hasil SUS
* hasil UAT
* hasil usability
* hasil performa jaringan

Jika hasil pengujian belum tersedia, katakan bahwa data tersebut belum tersedia.

Jangan mengubah asumsi menjadi fakta.

Jangan menyebut sistem sebagai "real-time" berdasarkan asumsi.

Istilah real-time harus didukung oleh hasil pengujian yang relevan.

# 21. Prinsip Utama Arsitektur

Pertahankan pemisahan berikut:

```text
WEB
=
User Interface
+
Application Management


MEDIAMTX
=
Video Streaming


RASPBERRY PI
=
Streaming Infrastructure


AI SERVER
=
Computer Vision


SUPABASE
=
Persistent Database
```

Jangan menggabungkan tanggung jawab tersebut tanpa alasan teknis yang jelas.

# 22. Prinsip Agent

Ketika mengerjakan project ini, agent harus:

* membaca kode yang sudah ada sebelum melakukan perubahan
* mempertahankan arsitektur yang telah ditentukan
* melakukan perubahan seminimal mungkin
* menggunakan kembali kode yang sudah tersedia
* menghindari dependency yang tidak diperlukan
* tidak melakukan refactoring besar tanpa alasan
* menjaga keamanan credential
* mempertimbangkan keterbatasan Raspberry Pi
* mempertimbangkan kondisi jaringan CCTV
* mempertimbangkan latency WebRTC dan HLS
* menjaga AI tetap terpisah dari frontend
* menjaga akses database tetap aman
* memastikan implementasi dapat dijelaskan dalam konteks skripsi

Jika terdapat beberapa solusi teknis yang memungkinkan, prioritaskan solusi yang:

1. paling sederhana
2. paling mudah dipelihara
3. sesuai dengan arsitektur project
4. mudah diuji
5. mudah dijelaskan pada sidang skripsi

Jangan mengubah arsitektur utama hanya untuk menyelesaikan masalah kecil.

<!-- END:nextjs-agent-rules -->
