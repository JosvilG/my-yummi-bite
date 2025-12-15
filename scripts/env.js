const fs = require('fs');
const path = require('path');

const normalizeAppEnv = (value) => {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return 'dev';
  if (raw === 'development' || raw === 'dev') return 'dev';
  if (raw === 'preprod' || raw === 'preproduction' || raw === 'staging') return 'preprod';
  if (raw === 'prod' || raw === 'production') return 'production';
  return raw;
};

const getEnvFileForAppEnv = (appEnv) => {
  const normalized = normalizeAppEnv(appEnv);
  if (normalized === 'preprod') return '.env.preprod';
  if (normalized === 'production') return '.env.production';
  return '.env';
};

const parseDotEnv = (content) => {
  const result = {};
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const withoutExport = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed;
    const eqIndex = withoutExport.indexOf('=');
    if (eqIndex === -1) continue;

    const key = withoutExport.slice(0, eqIndex).trim();
    let value = withoutExport.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!key) continue;
    result[key] = value;
  }
  return result;
};

const loadEnvFile = (filePath, options = {}) => {
  const { override = true, required = true } = options;
  const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    if (required) {
      throw new Error(`Env file not found: ${absolutePath}`);
    }
    return { loaded: false, filePath: absolutePath, keys: [] };
  }

  const content = fs.readFileSync(absolutePath, 'utf8');
  const parsed = parseDotEnv(content);

  for (const [key, value] of Object.entries(parsed)) {
    if (!override && process.env[key] != null) continue;
    process.env[key] = value;
  }

  return { loaded: true, filePath: absolutePath, keys: Object.keys(parsed) };
};

const loadEnvForAppEnv = (appEnv, options = {}) => {
  const normalized = normalizeAppEnv(appEnv);
  const envFile = getEnvFileForAppEnv(normalized);
  const result = loadEnvFile(envFile, { ...options, required: false });

  const expoPublicEnv = normalized === 'preprod' ? 'preprod' : normalized === 'production' ? 'production' : 'development';
  if (!options.override && process.env.EXPO_PUBLIC_APP_ENV != null) return { ...result, appEnv: normalized };
  process.env.EXPO_PUBLIC_APP_ENV = process.env.EXPO_PUBLIC_APP_ENV || expoPublicEnv;

  return { ...result, appEnv: normalized };
};

module.exports = {
  normalizeAppEnv,
  getEnvFileForAppEnv,
  parseDotEnv,
  loadEnvFile,
  loadEnvForAppEnv,
};

