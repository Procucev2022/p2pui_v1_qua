'use strict';

/**
 * Production static file server for the built Angular application.
 *
 * This file is copied into `dist/p2pui-gmtbfs/` by the deployment workflow, so
 * `__dirname` is the site root that contains `index.html`.
 *
 * Used by Azure App Service on **Linux** (Node). It intentionally has ZERO npm
 * dependencies so the deployed package needs no `node_modules` and no Oryx
 * build step.
 *
 * On Azure App Service for **Windows/IIS** this file is ignored; `web.config`
 * handles static hosting and the SPA fallback instead.
 *
 * Responsibilities:
 *   - listen on Azure's injected PORT
 *   - serve hashed Angular bundles / CSS / assets with correct MIME types
 *   - fall back to index.html for path-based Angular routes (deep links,
 *     browser refresh) without masking genuinely missing asset files
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 8080;
const INDEX_FILE = path.join(ROOT, 'index.html');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.wasm': 'application/wasm',
  '.pdf': 'application/pdf',
  '.webmanifest': 'application/manifest+json'
};

// Types worth gzipping. The initial payload is dominated by JS + CSS.
const COMPRESSIBLE = new Set([
  '.html', '.js', '.mjs', '.css', '.json', '.map', '.txt', '.xml', '.svg', '.webmanifest'
]);

// Angular emits content-hashed filenames (e.g. main.6ad2d208e67b1d2c.js) with
// `outputHashing: all`. Those are safe to cache forever.
const HASHED_ASSET = /\.[0-9a-f]{8,}\.[a-z0-9]+$/i;

// Runtime plumbing that lives in the web root but must never be downloadable.
const BLOCKED_FILES = new Set(['server.js', 'package.json', 'package-lock.json', 'web.config']);

function mimeTypeFor(ext) {
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function cacheControlFor(ext, relativePath) {
  // index.html must never be cached, otherwise clients keep loading stale
  // bundle references after a deployment.
  if (ext === '.html') {
    return 'no-cache, no-store, must-revalidate';
  }
  if (HASHED_ASSET.test(relativePath)) {
    return 'public, max-age=31536000, immutable';
  }
  return 'public, max-age=3600';
}

/**
 * Resolve a URL pathname to a file inside ROOT, or null when the path escapes
 * ROOT (directory traversal) or cannot be decoded.
 */
function resolveWithinRoot(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  // Reject encoded NUL bytes outright.
  if (decoded.indexOf('\0') !== -1) {
    return null;
  }

  const resolved = path.resolve(ROOT, '.' + path.posix.normalize(decoded));
  if (resolved !== ROOT && !resolved.startsWith(ROOT + path.sep)) {
    return null;
  }
  return resolved;
}

function sendPlain(res, statusCode, message) {
  const body = Buffer.from(message, 'utf8');
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(body);
}

function sendFile(req, res, filePath, statusCode, stats) {
  const ext = path.extname(filePath).toLowerCase();
  const relativePath = path.relative(ROOT, filePath).split(path.sep).join('/');

  const headers = {
    'Content-Type': mimeTypeFor(ext),
    'Cache-Control': cacheControlFor(ext, relativePath),
    'X-Content-Type-Options': 'nosniff',
    'Last-Modified': stats.mtime.toUTCString()
  };

  const acceptEncoding = String(req.headers['accept-encoding'] || '');
  const useGzip = COMPRESSIBLE.has(ext) && /\bgzip\b/.test(acceptEncoding);

  if (COMPRESSIBLE.has(ext)) {
    headers['Vary'] = 'Accept-Encoding';
  }

  if (useGzip) {
    // Content-Length is unknown once compressed, so it is deliberately omitted.
    headers['Content-Encoding'] = 'gzip';
  } else {
    headers['Content-Length'] = stats.size;
  }

  res.writeHead(statusCode, headers);

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {
    res.destroy();
  });

  if (useGzip) {
    const gzip = zlib.createGzip();
    gzip.on('error', () => res.destroy());
    stream.pipe(gzip).pipe(res);
  } else {
    stream.pipe(res);
  }
}

function serveIndexFallback(req, res) {
  fs.stat(INDEX_FILE, (err, stats) => {
    if (err || !stats.isFile()) {
      sendPlain(res, 500, 'index.html is missing from the deployment package.');
      return;
    }
    // 200 (not 302/404) so the Angular router boots and resolves the route.
    sendFile(req, res, INDEX_FILE, 200, stats);
  });
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Allow': 'GET, HEAD', 'Content-Length': 0 });
    res.end();
    return;
  }

  const pathname = new URL(req.url, 'http://localhost').pathname;
  const target = resolveWithinRoot(pathname);

  if (target === null) {
    sendPlain(res, 400, 'Bad request');
    return;
  }

  // Never serve the runtime plumbing or dotfiles, even though they sit in the
  // web root. Checked on the resolved path so encoded traversal that normalises
  // onto one of these names is also rejected.
  const resolvedName = path.basename(target);
  if (BLOCKED_FILES.has(resolvedName.toLowerCase()) || resolvedName.startsWith('.')) {
    sendPlain(res, 404, 'Not found');
    return;
  }

  fs.stat(target, (err, stats) => {
    if (!err && stats.isFile()) {
      sendFile(req, res, target, 200, stats);
      return;
    }

    if (!err && stats.isDirectory()) {
      const indexInDir = path.join(target, 'index.html');
      fs.stat(indexInDir, (dirErr, dirStats) => {
        if (!dirErr && dirStats.isFile()) {
          sendFile(req, res, indexInDir, 200, dirStats);
        } else {
          serveIndexFallback(req, res);
        }
      });
      return;
    }

    // Not on disk. A request that looks like a static asset should 404 rather
    // than silently return HTML - otherwise a missing bundle surfaces as a
    // confusing "Unexpected token '<'" parse error in the browser.
    const ext = path.extname(pathname).toLowerCase();
    const looksLikeAsset = ext !== '' && ext !== '.html';
    if (looksLikeAsset || pathname.startsWith('/assets/')) {
      sendPlain(res, 404, 'Not found');
      return;
    }

    // Otherwise treat it as an Angular route (/dashboard, /vendors, ...).
    serveIndexFallback(req, res);
  });
});

server.listen(PORT, () => {
  // Diagnostic only - no secret values are logged.
  console.log(`[static-server] serving ${ROOT} on port ${PORT}`);
});
