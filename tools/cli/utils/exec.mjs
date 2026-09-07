/**
 * Hansprint CLI
 * Process Execution Utility
 */

import { spawn } from "node:child_process";

/**
 * Execute a command and stream output directly to the terminal.
 *
 * @param {string} command
 * @param {string[]} args
 * @param {import("node:child_process").SpawnOptions} options
 * @returns {Promise<void>}
 */
export function exec(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      ...options
    });

    child.on("error", reject);

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `Command failed (${code}): ${command} ${args.join(" ")}`
        )
      );
    });
  });
}

/**
 * Execute a command and capture stdout.
 *
 * @param {string} command
 * @param {string[]} args
 * @param {import("node:child_process").SpawnOptions} options
 * @returns {Promise<string>}
 */
export function execCapture(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      shell: process.platform === "win32",
      ...options
    });

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);

    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim());
        return;
      }

      reject(
        new Error(
          stderr.trim() ||
          `Command failed (${code}): ${command} ${args.join(" ")}`
        )
      );
    });
  });
}