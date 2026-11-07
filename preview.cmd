@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0mylink\scripts\start-preview.ps1"
if errorlevel 1 pause
