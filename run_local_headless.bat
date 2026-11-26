@echo off
chcp 65001 > nul
title E.S.I.S Plan B: Local Laptop Patrol (HEADLESS TERMINAL - NO GUI)
cls

echo ===============================================================================
echo   E.S.I.S (Electronic Smoking Identification System)
echo   PLAN B: Local Laptop Patrol Monitor (MODE TERMINAL HEADLESS - TANPA GUI)
echo ===============================================================================
echo.
echo  Target 4 Kamera Lab Switch PLT:
echo   - Lab Riset Lantai 5 (H.265 Channel 101 Mainstream 1080p)
echo   - Lab Sistem Digital (H.264 Channel 101 Mainstream 1080p)
echo   - Lab OS (H.264 Channel 101 Mainstream 1080p)
echo   - Lab Programming (H.264 Channel 101 Mainstream 1080p)
echo.
echo  Fitur Headless:
echo   - Tanpa pop-up jendela GUI OpenCV (sangat hemat resource GPU/CPU)
echo   - Log pemantauan berkala tampil langsung di Command Line
echo   - Deteksi rokok konsisten >= 3s otomatis upload foto ke R2 & Web API
echo   - Telemetri live feed tetap berjalan di latar belakang
echo   - Tekan Ctrl+C untuk berhenti
echo ===============================================================================
echo.

if exist "%~dp0AI Server\Fix\Plan_B_Local_Laptop" (
    cd /d "%~dp0AI Server\Fix\Plan_B_Local_Laptop"
) else (
    cd /d "%~dp0AI Server\Plan_B_Local_Laptop"
)
python main_local_gui.py --headless --interval 60 --skip-sec 10 --channel 101 --api-port 8001 %*

pause
