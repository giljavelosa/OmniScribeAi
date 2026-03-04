const fs = require("fs");
const path = require("path");

function loadEnv(envPath) {
  const vars = {};
  if (!fs.existsSync(envPath)) return vars;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    vars[key] = val;
  }
  return vars;
}

const appDir = "/home/omniscribe/omniscribeai/app";
const dotenv = loadEnv(path.join(appDir, ".env"));

module.exports = {
  apps: [{
    name: "omniscribe",
    cwd: appDir,
    script: "node_modules/.bin/next",
    args: "start",
    env: {
      NODE_ENV: "production",
      PORT: 3000,
      ...dotenv,
    },
  }],
};
