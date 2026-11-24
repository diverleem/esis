@echo off
chcp 65001 > nul
title E.S.I.S Plan B: Local Laptop Patrol Monitor (GeForce MX550)
cls

echo ===============================================================================
echo   E.S.I.S (Electronic Smoking Identification System)
echo   PLAN B: Local Laptop Patrol Monitor (RTSP Mainstream Channel 101)
echo ===============================================================================
echo.
echo  Target 4 Kamera Lab Switch PLT:
echo   - Lab Riset Lantai 5 (H.265 Channel 101 Mainstream 1080p)
echo   - Lab Sistem Digital (H.264 Channel 101 Mainstream 1080p)
echo   - Lab OS (H.264 Channel 101 Mainstream 1080p)
echo   - Lab Programming (H.264 Channel 101 Mainstream 1080p)
echo.
echo  Skema: 10 Detik Human Detection -> Auto-Skip jika nihil -> Rokok & Face jika ada.
echo  RTSP Stream: Channel 101 (Mainstream Full HD untuk AI Akurasi Tinggi)
echo  API Server aktif di http://localhost:8001/
echo  Telemetri otomatis dikirim ke Web Next.js (/api/ai/live-feed)
echo ===============================================================================
echo.

cd /d "%~dp0AI Server\Plan_B_Local_Laptop"
python main_local_gui.py --interval 60 --skip-sec 10 --channel 101 --api-port 8001 %*

pause
