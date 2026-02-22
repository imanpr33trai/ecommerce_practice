@echo off
REM ==========================================
REM Development Starter Script (Windows)
REM Hybrid JIT/AOT strategy for optimal performance
REM ==========================================

echo [INFO] Step 1: Prebuilding stable packages (AOT)...

echo   Building @ecomerceNextjs/env...
call pnpm --filter @ecomerceNextjs/env build >nul 2>&1

echo   Building @ecomerceNextjs/db...
call pnpm --filter @ecomerceNextjs/db build >nul 2>&1

echo   Building @ecomerceNextjs/auth...
call pnpm --filter @ecomerceNextjs/auth build >nul 2>&1

echo [SUCCESS] Stable packages built!

REM ==========================================
REM Step 2: Start development watchers
REM Only watch actively developed packages
REM ==========================================
echo [INFO] Step 2: Starting development watchers...
echo   Only watching: api, server, web
echo.
echo   Stable packages (AOT): env, db, auth
echo   Watch mode (JIT): api, server, web
echo.

REM Use turbo to run dev with proper dependency handling
call pnpm turbo run dev ^
  --filter=server... ^
  --filter=web... ^
  --concurrency=10
