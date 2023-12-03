import config from './config/index.js';
import server from './server.js';

async function startServer() {
  // Get port from environment and store in Express.
  server.listen(config.port, () => {
    console.log(`
        ################################################
        🛡️  Server listening on port: ${config.port} 🛡️
        ################################################
    `);
  });
}

startServer();
