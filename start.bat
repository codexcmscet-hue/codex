@echo off
echo ===================================================
echo   Starting CodeX Club Application Stack
echo ===================================================

echo [1/2] Ensuring Docker database containers are running...
docker compose up -d

echo [2/2] Launching Backend & Frontend concurrently...
echo (Press Ctrl+C at any time to instantly terminate all servers)
echo ---------------------------------------------------
npm run dev
