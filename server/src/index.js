import express from 'express';
import config from './config/index.js';

async function startServer() {
  const app = express();

  // all the api routers
  // app.use("/api", index);

  // Get port from environment and store in Express.
  app.listen(config.port, () => {
    console.log(`
        ################################################
        🛡️  Server listening on port: ${config.port} 🛡️
        ################################################
    `);
  });
}

startServer();
