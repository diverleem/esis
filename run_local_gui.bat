@echo off
chcp 65001 > nul
title E.S.I.S 4-Lab Local Patrol GUI (GeForce MX550)
cls

echo ===============================================================================
echo   E.S.I.S (Electronic Smoking Identification System)
echo   Local Verification Monitor - KHUSUS 4 LAB (Tanpa Web / Pure GUI)
echo ===============================================================================
echo.
echo  Daftar 4 Lab Target:
echo   [1] Lab Riset Lantai 5 (H.265)
echo   [2] Lab Sistem Digital (H.264)
echo   [3] Lab OS (H.264)
echo   [4] Lab Programming (H.264)
echo.
echo  Alur Model Berjenjang:
echo   - Deteksi Manusia (YOLOv8n)
echo   - Deteksi Merokok vs Pulpen (Model Rokok)
echo   - Capture & Face Recognition Mahasiswa (YuNet + FaceNet)
echo.
echo  Aturan:
echo   - 60 Detik per lab (atau skip setelah 10 detik jika tidak ada orang)
echo.
echo ===============================================================================
echo.

cd /d "%~dp0AI Server\aimodelsv1"
python main_patrol_gui.py --interval 60 --skip-sec 10 --channel 102 %*

pause
