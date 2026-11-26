@echo off
chcp 65001 > nul
title E.S.I.S Plan B: Mock Mode (Uji Coba Mandiri / Rumah)
cls

echo ===============================================================================
echo   E.S.I.S (Electronic Smoking Identification System)
echo   PLAN B: Local Laptop Patrol Monitor (MODE MOCK - UJI COBA RUMAH)
echo ===============================================================================
echo.
echo  Mode ini menggunakan Webcam Laptop / Kamera Simulasi.
echo  Sangat cocok untuk testing saat di rumah tanpa koneksi LAN CCTV Kampus!
echo.
echo  Fitur Uji Coba:
echo   - Menjalankan YOLOv8n (Deteksi Manusia + Tracking Stabil)
echo   - Menjalankan YOLO11s (Deteksi Objek Rokok)
echo   - Menjalankan YuNet + FaceNet (Database 38 Mahasiswa)
echo   - Telemetri otomatis dikirim ke Web Next.js (http://localhost:3000/cctv)
echo.
echo  Kontrol Keyboard di Monitor:
echo   [T] : Picu simulasi pelanggaran rokok manual langsung
echo   [R] : Muat ulang basis data wajah mahasiswa (.npz)
echo   [M] : Alihkan antara Webcam dan RTSP CCTV
echo   [S] : Kunci/Buka kunci lab patroli
echo   [Q] : Keluar
echo ===============================================================================
echo.

if exist "%~dp0AI Server\Fix\Plan_B_Local_Laptop" (
    cd /d "%~dp0AI Server\Fix\Plan_B_Local_Laptop"
) else (
    cd /d "%~dp0AI Server\Plan_B_Local_Laptop"
)
python main_local_gui.py --mock --interval 60 --skip-sec 10 --api-port 8001 %*

pause
