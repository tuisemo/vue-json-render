@echo off
echo ========================================
echo Vue JSON Render - Setup and Run
echo ========================================
echo.

echo [1/3] Installing dependencies...
pnpm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    exit /b 1
)
echo Done!
echo.

echo [2/3] Building packages...
pnpm build
if %errorlevel% neq 0 (
    echo Failed to build packages
    exit /b 1
)
echo Done!
echo.

echo [3/3] Starting dev server...
pnpm dev
