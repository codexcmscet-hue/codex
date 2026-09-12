@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo     Launching CodeX Club Application Stack
echo ===================================================

:: 1. Check for node_modules and install dependencies if fresh zip extraction
if not exist "node_modules\" (
    echo [1/4] Installing dependencies across workspaces...
    call npm install
) else (
    echo [1/4] Dependencies verified.
)

:: 2. Ensure shared package is built
echo [2/4] Building shared schemas and types...
call npm run build --workspace=shared

:: 3. Start Docker databases
echo [3/4] Starting Docker databases (MongoDB, PostgreSQL, MinIO)...
docker compose up -d

:: 4. Launch development servers
echo [4/4] Starting Backend (Port 5000) and Frontend (Port 3000)...
echo ===================================================
echo   Access App: http://localhost:3000
echo   (Press Ctrl+C at any time to terminate all servers)
echo ===================================================
call npm run dev
