@echo off
title ANTARA - Cloudflare Public Tunnel
color 0B
cd /d "%~dp0"

echo ======================================================================
echo   ANTARA - CLOUDFLARE PUBLIC TUNNEL
echo ======================================================================
echo.
echo Launching Cloudflare tunnel to http://127.0.0.1:5173 ...
echo.
node "%~dp0scripts\tunnel.js"
