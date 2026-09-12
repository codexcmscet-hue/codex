@echo off
echo ===================================================
echo   Stopping CodeX Club (Ports 3000, 5000 & Docker)
echo ===================================================

echo [1/3] Terminating Node / Next.js / Express processes on ports 3000 and 5000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 "') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000 "') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [2/3] Stopping Docker databases (optional)...
docker compose down >nul 2>&1

echo [3/3] Done! All CodeX Club servers and processes terminated.
echo ===================================================
pause

