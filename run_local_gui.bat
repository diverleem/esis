@echo off
chcp 65001 > nul
title E.S.I.S Plan B: Local Laptop Patrol Monitor (GeForce MX550)
cls

echo ===============================================================================
echo   E.S.I.S (Electronic Smoking Identification System)
echo   PLAN B: Local Laptop Patrol Monitor (Substream Channel 102)
echo ===============================================================================
echo.
echo  Target 4 Kamera Lab Switch PLT (Substream Cepat & Ringan):
echo   - Lab Riset Lantai 5 (H.265 Channel 102)
echo   - Lab Sistem Digital (H.264 Channel 102)
echo   - Lab OS (H.264 Channel 102)
echo   - Lab Programming (H.264 Channel 102)
echo.
echo  Skema: 10 Detik Human Detection -> Auto-Skip jika nihil -> Rokok & Face jika ada.
echo  RTSP Stream: Channel 102 (Substream Hemat Bandwidth)
echo  API Server aktif di http://localhost:8001/
echo  Stream MJPEG aktif di http://localhost:8001/stream
echo ===============================================================================
echo.

cd /d "%~dp0AI Server\Plan_B_Local_Laptop"
python main_local_gui.py --interval 60 --skip-sec 10 --channel 102 --api-port 8001 %*

pause
