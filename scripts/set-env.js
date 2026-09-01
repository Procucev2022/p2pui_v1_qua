const fs = require('fs');
const path = require('path');

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const envConfig = {};
  content.split('\n').forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return;
    }
    const eqIdx = trimmedLine.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmedLine.substring(0, eqIdx).trim();
      let val = trimmedLine.substring(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      envConfig[key] = val;
    }
  });
  return envConfig;
}

/**
 * Values that must never be accepted as a real production secret. These are the
 * placeholders shipped in the *.example files plus the legacy hardcoded key.
 */
const REJECTED_PROD_SECRETS = new Set([
  'perm',
  'your_prod_storage_encryption_key',
  'your_dev_storage_encryption_key',
  'your_prod_basic_auth_token',
  'your_dev_basic_auth_token',
  'changeme',
  'placeholder'
]);

function firstNonEmpty(candidates) {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim() !== '') {
      return candidate;
    }
  }
  return undefined;
}

/**
 * Fails the build when a required production value is absent or is a known
 * placeholder. Only the variable *name* is reported - never its value.
 */
function requireProdSecret(name, value, acceptedFrom) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `[set-env] ${name} is required for a production build but was not provided.\n` +
      `          Set it as a GitHub Actions environment variable/secret for the "production" environment\n` +
      `          (accepted names, highest precedence first: ${acceptedFrom.join(', ')}),\n` +
      `          or in a local .env.prod file for a local production build.\n` +
      `          The build has been stopped instead of falling back to an insecure default.`
    );
  }
  if (REJECTED_PROD_SECRETS.has(value.trim().toLowerCase())) {
    throw new Error(
      `[set-env] ${name} is set to a known placeholder/legacy default value and is not safe for production.\n` +
      `          Provide a real value for the "production" environment. The build has been stopped.`
    );
  }
}

/**
 * Fails the build when the production backend URL was not supplied through an
 * environment-specific variable, or is not a usable https URL.
 */
function requireProdBackendUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      '[set-env] No environment-specific production backend URL was provided.\n' +
      '          Set QUA_BACKEND_URL (preferred) or PROD_BACKEND_URL as a variable/secret\n' +
      '          on the "production" GitHub environment - for example:\n' +
      '            QUA_BACKEND_URL=https://quaservicesp.procucev.com\n' +
      '          The generic BACKEND_URL is deliberately NOT accepted for production:\n' +
      '          it is visible to every environment, so a repository-level value could\n' +
      '          silently point production at a dev/staging backend.\n' +
      '          The build has been stopped rather than guess the backend.'
    );
  }

  let parsed;
  try {
    parsed = new URL(value.trim());
  } catch {
    throw new Error(
      `[set-env] The production backend URL is not a valid absolute URL: "${value.trim()}"\n` +
      '          Expected something like https://quaservicesp.procucev.com'
    );
  }
  if (parsed.protocol !== 'https:') {
    throw new Error(
      `[set-env] The production backend URL must use https, got "${parsed.protocol}//" .\n` +
      `          Value: ${parsed.origin}\n` +
      '          Refusing to build a production bundle that talks to a non-TLS backend.'
    );
  }
}

function resolveEnvConfig(isProdMode, strictProdSecrets) {
  const rootDir = path.resolve(__dirname, '..');

  const envDefault = parseEnvFile(path.join(rootDir, '.env'));
  const envLocal = parseEnvFile(path.join(rootDir, '.env.local'));
  const envProd = parseEnvFile(path.join(rootDir, '.env.prod'));
  const envProdLocal = parseEnvFile(path.join(rootDir, '.env.prod.local'));

  const scopedEnv = isProdMode ? { ...envDefault, ...envProd, ...envProdLocal } : { ...envDefault, ...envLocal };

  const DEFAULT_DEV_URL = 'https://p2pv1servicesdev-etfrcte5fhdvfrd4.centralindia-01.azurewebsites.net';
  const DEFAULT_PROD_URL = 'https://quaservicesp.procucev.com';
  const fallbackUrl = isProdMode ? DEFAULT_PROD_URL : DEFAULT_DEV_URL;

  // Environment-specific names must win over the generic ones. Otherwise a
  // repository-level `BACKEND_URL` (which is visible to every environment)
  // silently redirects the production build to whatever it points at.
  const prodScopedUrlCandidates = isProdMode
    ? [
        process.env.QUA_BACKEND_URL,
        process.env.PROD_BACKEND_URL,
        scopedEnv.QUA_BACKEND_URL,
        scopedEnv.PROD_BACKEND_URL
      ]
    : [];

  let backendUrl;

  if (strictProdSecrets) {
    // Production deployment build. The backend URL MUST come from an
    // environment-specific variable. Falling back to the generic BACKEND_URL
    // (which is visible to every GitHub environment) or to a URL hardcoded in
    // this repo are both silent-misconfiguration hazards: production would keep
    // deploying happily while pointing at the wrong backend.
    const scopedProdUrl = firstNonEmpty(prodScopedUrlCandidates);
    requireProdBackendUrl(scopedProdUrl);
    backendUrl = scopedProdUrl;
  } else {
    backendUrl = firstNonEmpty([
      ...prodScopedUrlCandidates,
      process.env.BACKEND_URL,
      process.env.API_ENDPOINT,
      process.env.API_URL,
      scopedEnv.BACKEND_URL,
      scopedEnv.API_ENDPOINT,
      scopedEnv.API_URL,
      fallbackUrl
    ]);
  }

  const prodScopedKeyCandidates = isProdMode
    ? [
        process.env.QUA_STORAGE_ENCRYPTION_KEY,
        process.env.PROD_STORAGE_ENCRYPTION_KEY,
        scopedEnv.QUA_STORAGE_ENCRYPTION_KEY,
        scopedEnv.PROD_STORAGE_ENCRYPTION_KEY
      ]
    : [];

  const prodScopedTokenCandidates = isProdMode
    ? [
        process.env.QUA_BASIC_AUTH_TOKEN,
        process.env.PROD_BASIC_AUTH_TOKEN,
        scopedEnv.QUA_BASIC_AUTH_TOKEN,
        scopedEnv.PROD_BASIC_AUTH_TOKEN
      ]
    : [];

  const resolvedStorageKey = firstNonEmpty([
    ...prodScopedKeyCandidates,
    process.env.STORAGE_ENCRYPTION_KEY,
    scopedEnv.STORAGE_ENCRYPTION_KEY
  ]);

  const resolvedBasicAuthToken = firstNonEmpty([
    ...prodScopedTokenCandidates,
    process.env.BASIC_AUTH_TOKEN,
    scopedEnv.BASIC_AUTH_TOKEN
  ]);

  let storageEncryptionKey;
  let basicAuthToken;

  if (strictProdSecrets) {
    // Production deployment build: no insecure fallbacks. Missing or
    // placeholder values stop the build.
    requireProdSecret('STORAGE_ENCRYPTION_KEY', resolvedStorageKey, [
      'QUA_STORAGE_ENCRYPTION_KEY',
      'PROD_STORAGE_ENCRYPTION_KEY',
      'STORAGE_ENCRYPTION_KEY'
    ]);
    requireProdSecret('BASIC_AUTH_TOKEN', resolvedBasicAuthToken, [
      'QUA_BASIC_AUTH_TOKEN',
      'PROD_BASIC_AUTH_TOKEN',
      'BASIC_AUTH_TOKEN'
    ]);
    storageEncryptionKey = resolvedStorageKey;
    basicAuthToken = resolvedBasicAuthToken;
  } else {
    // Local development, unit tests and non-production builds keep the
    // previous permissive behaviour so nothing in the dev loop breaks.
    storageEncryptionKey = resolvedStorageKey || 'perm';
    basicAuthToken = resolvedBasicAuthToken || '';
  }

  const proxyTarget =
    process.env.PROXY_TARGET ||
    scopedEnv.PROXY_TARGET ||
    backendUrl;

  return {
    backendUrl: backendUrl.replace(/\/+$/, ''),
    storageEncryptionKey,
    basicAuthToken,
    proxyTarget: proxyTarget.replace(/\/+$/, '')
  };
}

function resolveFileMode() {
  const rootDir = path.resolve(__dirname, '..');

  const devFilesEnv = {
    ...parseEnvFile(path.join(rootDir, '.env')),
    ...parseEnvFile(path.join(rootDir, '.env.local'))
  };
  const prodFilesEnv = {
    ...parseEnvFile(path.join(rootDir, '.env.prod')),
    ...parseEnvFile(path.join(rootDir, '.env.prod.local'))
  };

  const fileEnv =
    devFilesEnv.NODE_ENV !== undefined || devFilesEnv.PRODUCTION !== undefined
      ? devFilesEnv
      : prodFilesEnv;

  if (fileEnv.NODE_ENV === 'production' || fileEnv.PRODUCTION === 'true') {
    return true;
  }
  if (fileEnv.NODE_ENV !== undefined || fileEnv.PRODUCTION !== undefined) {
    return false;
  }
  return null;
}

function setEnvironment() {
  const args = process.argv.slice(2);
  const isProdArg =
    args.includes('--prod') ||
    args.includes('--production') ||
    args.some((a) => a.includes('production') || a.includes('prod'));
  const isProdEnv =
    process.env.NODE_ENV === 'production' ||
    process.env.ENV === 'prod' ||
    process.env.PRODUCTION === 'true';
  const isProd = isProdArg || isProdEnv || resolveFileMode() === true;

  // Strict mode removes every insecure fallback. It is enabled when this is a
  // real production build, or when a deployment workflow explicitly demands
  // real values via REQUIRE_RUNTIME_SECRETS=true.
  const strictProdSecrets =
    isProd || String(process.env.REQUIRE_RUNTIME_SECRETS).toLowerCase() === 'true';

  const devConfig = resolveEnvConfig(false, false);
  const prodConfig = resolveEnvConfig(true, strictProdSecrets);
  const currentConfig = isProd ? prodConfig : devConfig;

  const envDir = path.resolve(__dirname, '../src/environments');
  if (!fs.existsSync(envDir)) {
    fs.mkdirSync(envDir, { recursive: true });
  }

  // NOTE: everything in these generated files is compiled into the browser
  // bundle and is therefore publicly readable by anyone who loads the site.
  // `storageEncryptionKey` and `basicAuthToken` are required client-side by
  // EncryDecryService (localStorage crypto) and AuthenticationService (the
  // OAuth2 password-grant Authorization header), so they cannot be removed
  // without a backend token-exchange endpoint to replace the password grant.
  const generatedBanner = `// Auto-generated by scripts/set-env.js - DO NOT EDIT, DO NOT COMMIT.
// WARNING: these values are compiled into the public browser bundle.
// Never put a server-side-only credential in here.`;

  const devEnvFileContent = `${generatedBanner}
export const environment = {
  production: false,
  baseURL: ${JSON.stringify(devConfig.backendUrl)},
  apiEndpoint: ${JSON.stringify(devConfig.backendUrl)},
  storageEncryptionKey: ${JSON.stringify(devConfig.storageEncryptionKey)},
  basicAuthToken: ${JSON.stringify(devConfig.basicAuthToken)}
};
`;

  const prodEnvFileContent = `${generatedBanner}
export const environment = {
  production: true,
  baseURL: ${JSON.stringify(prodConfig.backendUrl)},
  apiEndpoint: ${JSON.stringify(prodConfig.backendUrl)},
  storageEncryptionKey: ${JSON.stringify(prodConfig.storageEncryptionKey)},
  basicAuthToken: ${JSON.stringify(prodConfig.basicAuthToken)}
};
`;

  const devFilePath = path.join(envDir, 'environment.ts');
  const prodFilePath = path.join(envDir, 'environment.prod.ts');

  fs.writeFileSync(devFilePath, devEnvFileContent, 'utf8');
  fs.writeFileSync(prodFilePath, prodEnvFileContent, 'utf8');

  // Update proxy.config.json
  const proxyPath = path.resolve(__dirname, '../proxy.config.json');
  const proxyConfig = {
    '/oauth': {
      target: currentConfig.proxyTarget,
      secure: false,
      logLevel: 'debug',
      changeOrigin: true
    }
  };
  fs.writeFileSync(proxyPath, JSON.stringify(proxyConfig, null, 2) + '\n', 'utf8');

  console.log(`[set-env] Active Mode: ${isProd ? 'production' : 'development'}`);
  console.log(`[set-env] Strict secret validation: ${strictProdSecrets ? 'ON' : 'off'}`);
  console.log(`[set-env] Backend URL (Dev) -> ${devConfig.backendUrl}`);
  console.log(`[set-env] Backend URL (Prod) -> ${prodConfig.backendUrl}`);
  // Presence only - secret values are never printed.
  console.log(`[set-env] STORAGE_ENCRYPTION_KEY (active): ${currentConfig.storageEncryptionKey ? 'configured' : 'MISSING'}`);
  console.log(`[set-env] BASIC_AUTH_TOKEN (active): ${currentConfig.basicAuthToken ? 'configured' : 'MISSING'}`);
}

try {
  setEnvironment();
} catch (error) {
  // Print the message only. Never dump the environment or a stack trace that
  // could contain a resolved secret.
  console.error('');
  console.error(error && error.message ? error.message : String(error));
  console.error('');
  process.exit(1);
}
