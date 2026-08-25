#!/usr/bin/env node
/**
 * Resolve a Chromium-based browser for Karma on local Windows/macOS/Linux.
 * Prefer CHROME_BIN if already set; otherwise try Chrome, then Edge.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function exists(p) {
  try {
    return Boolean(p) && fs.existsSync(p);
  } catch {
    return false;
  }
}

function candidates() {
  const list = [];
  if (process.env.CHROME_BIN) list.push(process.env.CHROME_BIN);

  if (process.platform === 'win32') {
    const pf = process.env['PROGRAMFILES'] || 'C:\\Program Files';
    const pf86 = process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)';
    const local = process.env.LOCALAPPDATA || '';
    list.push(
      path.join(pf, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(pf86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(local, 'Google', 'Chrome', 'Application', 'chrome.exe'),
      path.join(pf86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
      path.join(pf, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
      path.join(local, 'Microsoft', 'Edge', 'Application', 'msedge.exe')
    );
  } else if (process.platform === 'darwin') {
    list.push(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
    );
  } else {
    list.push(
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/usr/bin/microsoft-edge',
      '/usr/bin/microsoft-edge-stable'
    );
  }
  return list;
}

const found = candidates().find(exists);
if (!found) {
  console.error(
    'No Chrome/Edge binary found. Install Chrome or set CHROME_BIN.'
  );
  process.exit(1);
}

process.env.CHROME_BIN = found;
console.log(`Using browser: ${found}`);

const args = process.argv.slice(2);
if (!args.length) process.exit(0);

const result = spawnSync(args[0], args.slice(1), {
  stdio: 'inherit',
  env: process.env,
  shell: process.platform === 'win32',
});
process.exit(result.status == null ? 1 : result.status);
