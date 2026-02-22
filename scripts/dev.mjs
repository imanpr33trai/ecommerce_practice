#!/usr/bin/env node
/**
 * Development Starter Script
 * Hybrid JIT/AOT strategy for optimal performance
 *
 * Prebuilds stable packages once, then watches only actively developed packages
 */

import { spawn } from "child_process";

// const exec = promisify(require("child_process").exec);

// Colors for output
const colors = {
  reset: "\x1b[0m",
  blue: "\x1b[0;34m",
  green: "\x1b[0;32m",
  yellow: "\x1b[1;33m",
  red: "\x1b[0;31m",
};

function log(message) {
  console.log(`${colors.blue}[INFO]${colors.reset} ${message}`);
}

function success(message) {
  console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`);
}

function warn(message) {
  console.log(`${colors.yellow}[WARN]${colors.reset} ${message}`);
}

async function runCommand(command, silent = false) {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(" ");
    const proc = spawn(cmd, args, {
      stdio: silent ? "ignore" : "inherit",
      shell: true,
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed: ${command}`));
      }
    });

    proc.on("error", reject);
  });
}

async function main() {
  try {
    // ==========================================
    // Step 1: Prebuild stable packages (AOT)
    // These rarely change, so build once
    // ==========================================
    log("Step 1: Prebuilding stable packages (AOT)...");

    await runCommand("pnpm --filter @ecomerceNextjs/env build", true);
    process.stdout.write("  ✓ Built @ecomerceNextjs/env\n");

    await runCommand("pnpm --filter @ecomerceNextjs/db build", true);
    process.stdout.write("  ✓ Built @ecomerceNextjs/db\n");

    await runCommand("pnpm --filter @ecomerceNextjs/auth build", true);
    process.stdout.write("  ✓ Built @ecomerceNextjs/auth\n");

    success("Stable packages built!");

    // ==========================================
    // Step 2: Start development watchers
    // Only watch actively developed packages
    // ==========================================
    log("Step 2: Starting development watchers...");
    warn("Only watching: api, server, web");
    console.log("");
    console.log("  Stable packages (AOT): env, db, auth");
    console.log("  Watch mode (JIT):      api, server, web");
    console.log("");
    console.log("  Press Ctrl+C to stop");
    console.log("");

    // Use turbo to run dev with proper dependency handling
    await runCommand("pnpm turbo run dev --filter=server... --filter=web... --concurrency=10");
  } catch (error) {
    if (error.message.includes("SIGINT")) {
      console.log("\n");
      log("Development server stopped");
      process.exit(0);
    }
    console.error(`${colors.red}[ERROR]${colors.reset}`, error.message);
    process.exit(1);
  }
}

main();
