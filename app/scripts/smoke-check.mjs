import { spawn } from 'node:child_process';

const port = process.env.SMOKE_PORT || '4010';
const url = `http://127.0.0.1:${port}/login`;
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 60_000);

const child = spawn('npm', ['run', 'start', '--', '-p', port], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env,
});

let ready = false;
let logs = '';

const appendLog = (chunk) => {
  const text = chunk.toString();
  logs += text;
  if (logs.length > 8000) {
    logs = logs.slice(-8000);
  }
};

child.stdout.on('data', (chunk) => {
  appendLog(chunk);
  const line = chunk.toString();
  if (line.includes('Ready in') || line.includes('started server on')) {
    ready = true;
  }
});

child.stderr.on('data', appendLog);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForServer() {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (ready) {
      return;
    }

    try {
      const response = await fetch(url);
      if (response.ok || response.status === 302 || response.status === 307) {
        ready = true;
        return;
      }
    } catch {
      // retry until timeout
    }

    await sleep(500);
  }

  throw new Error(`Smoke timeout waiting for ${url}`);
}

async function main() {
  try {
    await waitForServer();

    const response = await fetch(url);
    if (!(response.ok || response.status === 302 || response.status === 307)) {
      throw new Error(`Unexpected smoke status: ${response.status}`);
    }

    console.log(`Smoke check passed: ${url} -> ${response.status}`);
  } finally {
    child.kill('SIGTERM');
    await sleep(500);
    if (!child.killed) {
      child.kill('SIGKILL');
    }
  }
}

main().catch((error) => {
  console.error('Smoke check failed');
  console.error(String(error));
  if (logs) {
    console.error('Recent server logs:');
    console.error(logs);
  }
  process.exit(1);
});
