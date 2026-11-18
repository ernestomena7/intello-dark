// Hostinger entry file. `npm start` runs the same thing.
import { loadDotEnv, loadConfig, ConfigError } from './src/config.js';
import { createApp } from './src/app.js';

loadDotEnv();

let config;
try {
  config = loadConfig();
} catch (err) {
  if (err instanceof ConfigError) {
    console.error(err.message);
    process.exit(1);
  }
  throw err;
}

const app = createApp(config);
const server = app.listen(config.port, () => {
  console.log(JSON.stringify({ event: 'start', port: server.address().port, node: process.version, env: config.nodeEnv, languages: ['es', 'en'], mail: config.mailMode }));
});

function shutdown(signal) {
  console.log(JSON.stringify({ event: 'shutdown', signal }));
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
