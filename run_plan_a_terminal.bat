@echo off
chcp 65001 > nul
title E.S.I.S Plan A: RunPod Terminal Monitor (Lab Riset Lt 5)
cls

echo ===============================================================================
echo   E.S.I.S (Electronic Smoking Identification System)
echo   PLAN A: RunPod Cloud Inference - Mode Terminal
echo ===============================================================================
echo.
echo  Target Kamera : Lab Riset Lantai 5
echo  Stream Source : https://fdxuqgcmfo.a.pinggy.link/cam_lab_riset_lt_5/index.m3u8
echo  API Server    : http://localhost:8001/
echo.
echo  Pilihan Eksekusi:
echo   - Default                        : Langsung membaca https://fdxuqgcmfo.a.pinggy.link/cam_lab_riset_lt_5/index.m3u8
echo   - Custom Stream Link             : run_plan_a_terminal.bat --stream-url ^<LINK_STREAM_CAM^>
echo   - Mode Mock Webcam Simulasi      : run_plan_a_terminal.bat --mock
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
