@echo off
title ANTARA - Launch Suite
color 0E
cd /d "%~dp0"

echo ======================================================================
echo   ANTARA - LAUNCHING LOCAL SERVER + PUBLIC CLOUDFLARE TUNNEL
echo ======================================================================
echo.
echo [1/2] Starting local Vite development server in separate window...
start "ANTARA - Web Server" cmd /c "%~dp0start-project.bat"

echo [2/2] Waiting for local server to initialize on port 5173...
timeout /t 3 /nobreak >nul

echo.
echo Launching Cloudflare public tunnel...
echo ======================================================================
call "%~dp0start-tunnel.bat"
