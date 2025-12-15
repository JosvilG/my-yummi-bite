const { spawn } = require('child_process');
const { loadEnvForAppEnv, normalizeAppEnv } = require('./env');

const [, , rawEnv, ...restArgs] = process.argv;

if (!rawEnv) {
  // eslint-disable-next-line no-console
  console.error('Usage: node scripts/expo.js <dev|preprod|production> <expo args...>');
  process.exit(1);
}

const appEnv = normalizeAppEnv(rawEnv);
loadEnvForAppEnv(appEnv, { override: true });

process.env.APP_ENV = appEnv;
process.env.EXPO_NO_DOTENV = '1';

const expoArgs = restArgs.length > 0 ? restArgs : ['start'];
const child = spawn('expo', expoArgs, {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

child.on('exit', (code) => process.exit(code ?? 0));

