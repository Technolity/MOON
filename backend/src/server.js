const { validateEnv } = require('./config/env');

// Fail fast before anything else if the environment is misconfigured
validateEnv();

const env = require('./config/env');
const app = require('./app');

const port = env.app.port;

const server = app.listen(port, () => {
  console.log(`${env.app.name} listening on port ${port} [${env.app.nodeEnv}]`);
});

function shutdown(signal) {
  console.log(`Received ${signal}. Shutting down ${env.app.name}.`);
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Catch unhandled promise rejections — log and exit so the process doesn't silently corrupt
process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err);
  process.exit(1);
});

module.exports = server;
