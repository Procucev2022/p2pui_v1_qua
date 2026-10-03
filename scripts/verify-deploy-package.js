'use strict';

/**
 * Verifies the staged Azure deployment package before it is uploaded/deployed.
 *
 * Guards against the two failure modes this project has hit:
 *   1. deploying the repository root (source, node_modules, dev-server config)
 *      instead of the compiled Angular application
 *   2. shipping a package that has no usable runtime entry point, so Azure
 *      falls back to `npm start` -> `ng serve --port 4201` and never binds to
 *      the port Azure probes
 *
 * Usage: node scripts/verify-deploy-package.js [packageDir]
 * Default packageDir: dist/p2pui-gmtbfs
 *
 * Exits non-zero with a readable report when a required item is missing.
 * Never prints file contents, so configured secrets cannot leak into CI logs.
 */

const fs = require('fs');
const path = require('path');

const packageDir = path.resolve(process.argv[2] || path.join('dist', 'p2pui-gmtbfs'));

const errors = [];
const notes = [];

function fail(message) {
  errors.push(message);
}

function listFiles(dir) {
  const out = [];
  (function walk(current) {
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        out.push(path.relative(packageDir, full).split(path.sep).join('/'));
      }
    }
  })(packageDir);
  return out;
}

if (!fs.existsSync(packageDir) || !fs.statSync(packageDir).isDirectory()) {
  console.error(`[verify-deploy-package] FAIL: package directory not found: ${packageDir}`);
  console.error('[verify-deploy-package] Run the Angular production build first.');
  process.exit(1);
}

const files = listFiles(packageDir);

if (files.length === 0) {
  console.error(`[verify-deploy-package] FAIL: package directory is empty: ${packageDir}`);
  process.exit(1);
}

// ---------------------------------------------------------------- required app
const indexPath = path.join(packageDir, 'index.html');
if (!fs.existsSync(indexPath)) {
  fail('index.html is missing (Azure would have no entry document to serve).');
} else if (fs.statSync(indexPath).size === 0) {
  fail('index.html is present but empty.');
} else {
  notes.push(`index.html (${fs.statSync(indexPath).size} bytes)`);
}

function requireMatch(label, predicate, hint) {
  const matched = files.filter(predicate);
  if (matched.length === 0) {
    fail(`no ${label} found in the package${hint ? ` (${hint})` : ''}.`);
  } else {
    notes.push(`${label}: ${matched.length} file(s)`);
  }
  return matched;
}

requireMatch('Angular JS bundles', (f) => /^[^/]*\.js$/.test(f) && !f.endsWith('server.js'));
requireMatch('main bundle', (f) => /^main(\.[0-9a-f]+)?\.js$/.test(f));
requireMatch('runtime bundle', (f) => /^runtime(\.[0-9a-f]+)?\.js$/.test(f));

// ------------------------------------------------------------------------
// Everything below is derived from angular.json rather than hardcoded, so the
// verifier cannot demand output the build was never configured to produce.
// A missing/unreadable angular.json degrades to warnings, never a false fail.
// ------------------------------------------------------------------------
const repoRoot = path.resolve(__dirname, '..');

function readBuildOptions() {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'angular.json'), 'utf8'));
    const projects = cfg.projects || {};
    const name = Object.keys(projects).find(
      (p) => projects[p].architect && projects[p].architect.build
    );
    if (!name) { return null; }
    return projects[name].architect.build.options || {};
  } catch {
    return null;
  }
}

const buildOptions = readBuildOptions();

if (!buildOptions) {
  notes.push('WARNING: angular.json could not be read - skipping config-derived asset/style checks.');
} else {
  // ---- polyfills: only emitted when configured ----
  const polyfillsCfg = buildOptions.polyfills;
  const hasPolyfills = Array.isArray(polyfillsCfg)
    ? polyfillsCfg.length > 0
    : Boolean(polyfillsCfg);
  if (hasPolyfills) {
    requireMatch('polyfills bundle', (f) => /^polyfills(\.[0-9a-f]+)?\.js$/.test(f));
  } else {
    notes.push('polyfills not configured in angular.json - not required');
  }

  // ---- styles: only emitted when configured ----
  const stylesCfg = Array.isArray(buildOptions.styles) ? buildOptions.styles : [];
  if (stylesCfg.length > 0) {
    requireMatch('CSS stylesheets', (f) => f.endsWith('.css'));
  } else {
    notes.push('no styles configured in angular.json - CSS not required');
  }

  // ---- assets: required only when the configured source actually has files ----
  function countFiles(dir) {
    let n = 0;
    (function walk(current) {
      let entries;
      try {
        entries = fs.readdirSync(current, { withFileTypes: true });
      } catch {
        return;
      }
      for (const e of entries) {
        if (e.isDirectory()) { walk(path.join(current, e.name)); } else if (e.isFile()) { n++; }
      }
    })(dir);
    return n;
  }

  function normalizeAssetEntry(entry) {
    if (typeof entry === 'string') {
      return { input: path.resolve(repoRoot, entry), outputPrefix: path.basename(entry) };
    }
    if (entry && typeof entry === 'object' && entry.input) {
      const out = String(entry.output || '').replace(/^\/+/, '').replace(/\/+$/, '');
      return { input: path.resolve(repoRoot, entry.input), outputPrefix: out };
    }
    return null;
  }

  const assetsCfg = Array.isArray(buildOptions.assets) ? buildOptions.assets : [];

  if (assetsCfg.length === 0) {
    notes.push('no assets configured in angular.json - asset output not required');
  }

  for (const rawEntry of assetsCfg) {
    const entry = normalizeAssetEntry(rawEntry);
    if (!entry) {
      notes.push(`WARNING: unrecognised angular.json assets entry - skipped: ${JSON.stringify(rawEntry)}`);
      continue;
    }

    let sourceStat = null;
    try {
      sourceStat = fs.statSync(entry.input);
    } catch {
      sourceStat = null;
    }

    const rel = path.relative(repoRoot, entry.input).split(path.sep).join('/');

    if (!sourceStat) {
      // Configured but absent from the source tree. That is a source-tree
      // concern, not a packaging regression - warn, do not fail the deploy.
      notes.push(`WARNING: configured asset source "${rel}" does not exist - nothing to verify.`);
      continue;
    }

    if (sourceStat.isDirectory()) {
      const sourceCount = countFiles(entry.input);
      if (sourceCount === 0) {
        notes.push(`asset source "${rel}" is empty - no output required (correctly not treated as a failure).`);
        continue;
      }
      const prefix = entry.outputPrefix ? entry.outputPrefix + '/' : '';
      const shipped = prefix ? files.filter((f) => f.startsWith(prefix)) : files;
      if (shipped.length === 0) {
        fail(
          `asset source "${rel}" contains ${sourceCount} file(s) but nothing was emitted to ` +
          `"${prefix || '<package root>'}" - static assets would 404 at runtime.`
        );
      } else {
        notes.push(`assets "${prefix || '<package root>'}": ${shipped.length} file(s) from ${rel}`);
      }
      continue;
    }

    // Single-file asset entry (e.g. "src/favicon.ico").
    const fileName = path.basename(entry.input);
    const expected = entry.outputPrefix && entry.outputPrefix !== fileName
      ? `${entry.outputPrefix}/${fileName}`
      : fileName;
    if (!files.includes(expected)) {
      fail(`configured asset file "${rel}" was not emitted to "${expected}".`);
    } else {
      notes.push(`asset file: ${expected}`);
    }
  }
}

// ------------------------------------------------------------ runtime plumbing
for (const required of ['server.js', 'web.config', 'package.json']) {
  if (!files.includes(required)) {
    fail(`${required} is missing (needed so Azure serves the build instead of falling back to the Angular dev server).`);
  } else {
    notes.push(`runtime file: ${required}`);
  }
}

if (files.includes('package.json')) {
  let runtimeManifest = null;
  try {
    runtimeManifest = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'));
  } catch {
    fail('the package.json in the deployment package is not valid JSON.');
  }
  if (runtimeManifest) {
    const startScript = (runtimeManifest.scripts && runtimeManifest.scripts.start) || '';
    if (!startScript) {
      fail('the deployed package.json has no "start" script.');
    } else if (/ng\s+serve/.test(startScript)) {
      fail('the deployed package.json still starts the Angular dev server (`ng serve`). It must start the static server.');
    } else {
      notes.push(`start script: ${startScript}`);
    }
    if (runtimeManifest.scripts && runtimeManifest.scripts.prestart) {
      fail('the deployed package.json defines a "prestart" hook; it would regenerate environment files at runtime without build-time configuration.');
    }
    if (runtimeManifest.dependencies && Object.keys(runtimeManifest.dependencies).length > 0) {
      fail('the deployed package.json declares dependencies; the static host must stay dependency-free so no node_modules install is required.');
    }
  }
}

// -------------------------------------------------- things that must NOT ship
const forbidden = [
  { label: 'node_modules/', match: (f) => f.startsWith('node_modules/') },
  { label: 'Angular sources (src/)', match: (f) => f.startsWith('src/') },
  { label: 'generated environment files', match: (f) => /(^|\/)environment(\.prod)?\.ts$/.test(f) },
  { label: 'dotenv files', match: (f) => /(^|\/)\.env(\.|$)/.test(f) },
  { label: 'ng serve proxy config', match: (f) => f === 'proxy.config.json' },
  { label: 'angular.json', match: (f) => f === 'angular.json' },
  { label: 'lockfiles', match: (f) => f === 'package-lock.json' || f === 'yarn.lock' },
  { label: 'TypeScript configs', match: (f) => /^tsconfig.*\.json$/.test(f) },
  { label: 'git metadata', match: (f) => f.startsWith('.git/') },
  { label: 'coverage output', match: (f) => f.startsWith('coverage/') },
  { label: 'unit test specs', match: (f) => f.endsWith('.spec.ts') || f.endsWith('.spec.js') }
];

for (const rule of forbidden) {
  const hits = files.filter(rule.match);
  if (hits.length > 0) {
    fail(`${rule.label} must not be in the deployment package (${hits.length} file(s), e.g. ${hits[0]}).`);
  }
}

// Source maps expose original TypeScript; flag but do not fail the deploy.
const sourceMaps = files.filter((f) => f.endsWith('.map'));
if (sourceMaps.length > 0) {
  notes.push(`WARNING: ${sourceMaps.length} source map(s) present - confirm this build used the production configuration.`);
}

// ------------------------------------------------------------------- reporting
console.log(`[verify-deploy-package] package: ${packageDir}`);
console.log(`[verify-deploy-package] total files: ${files.length}`);
for (const note of notes) {
  console.log(`[verify-deploy-package]   OK  ${note}`);
}

if (errors.length > 0) {
  console.error('');
  for (const message of errors) {
    console.error(`[verify-deploy-package]   ERR ${message}`);
  }
  console.error('');
  console.error(`[verify-deploy-package] FAILED with ${errors.length} problem(s).`);
  process.exit(1);
}

console.log('[verify-deploy-package] PASSED - package is deployable.');
