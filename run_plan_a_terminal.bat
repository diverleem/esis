@echo off
chcp 65001 > nul
title E.S.I.S Plan A: RunPod Terminal Monitor (4 Kamera Serentak)
cls

echo ===============================================================================
echo   E.S.I.S (Electronic Smoking Identification System)
echo   PLAN A: RunPod Cloud Inference - Mode Terminal (4 Kamera Serentak)
echo ===============================================================================
echo.
echo  Target Kamera : 4 Kamera (Lab Riset Lt 5, Lab OS, Lab Programming, Lobby Lt 5)
echo  Stream Source : Pinggy Pro HLS Port 8888 (fdxuqgcmfo.a.pinggy.link)
echo  Gated AI      : AI Rokok & Wajah HANYA jalan jika terdeteksi manusia
echo  Auto-Sleep    : Jika nihil manusia 10 detik -> AI Rokok/Wajah tidur 1 menit
echo  API Server    : http://localhost:8001/
echo  Stream MJPEG  : http://localhost:8001/stream (Grid 2x2 CCTV)
echo.
echo  Pilihan Eksekusi:
echo   - Default                        : Memantau 4 kamera serentak via Pinggy
echo   - Mode Mock Simulasi             : run_plan_a_terminal.bat --mock
echo.
echo  Tekan Ctrl+C di terminal untuk berhenti kapan saja.
echo ===============================================================================
echo.

if exist "%~dp0AI Server\Fix\Plan_A_RunPod" (
    cd /d "%~dp0AI Server\Fix\Plan_A_RunPod"
) else (
    cd /d "%~dp0AI Server\Plan_A_RunPod"
)

python main_runpod.py --cigar-model v3_onnx --person-model yolov8s --channel 101 --api-port 8001 --no-pinggy %*

pause
