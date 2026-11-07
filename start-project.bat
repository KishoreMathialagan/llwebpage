@echo off
title ANTARA - Application Server
color 0A
cd /d "%~dp0"

echo ======================================================================
echo   ANTARA - LOCAL APPLICATION SERVER
echo ======================================================================
echo.
echo Running npm run dev on port 5173...
echo.
npm run dev
