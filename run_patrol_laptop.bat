@echo off
chcp 65001 > nul
title E.S.I.S Smart Patrol Tour Face Recognition (Laptop GeForce MX550)
cls

echo ===============================================================================
echo   E.S.I.S (Electronic Smoking Identification System)
echo   Smart Patrol Tour - Direct RTSP Switch + Human Filter (GeForce MX550)
echo ===============================================================================
echo.
echo  [1] Membaca langsung dari Switch CCTV LAN PLT (172.20.32.x)
echo  [2] Human Detector Filter (YOLOv8n) aktif: Otomatis skip jika tidak ada manusia
echo  [3] Optimasi Memori ^& VRAM untuk laptop NVIDIA GeForce MX550
echo  [4] Web SOC Dashboard: http://localhost:8000/
echo.
echo ===============================================================================

cd /d "%~dp0AI Server\Face Model\Model Output"
python main_laptop_mx550.py --port 8000 --interval 30 --channel 102 %*

pause
