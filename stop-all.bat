@echo off
title ANTARA - Stop Services
color 0C
cd /d "%~dp0"

echo ======================================================================
echo   ANTARA - STOPPING SERVICES
echo ======================================================================
echo.

echo Terminating Vite node processes...
taskkill /F /IM node.exe /T 2>nul
echo Terminating Cloudflare tunnels...
taskkill /F /IM cloudflared.exe /T 2>nul

echo.
echo All background servers and tunnels have been stopped.
echo ======================================================================
pause
