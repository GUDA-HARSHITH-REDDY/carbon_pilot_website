import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Vite Custom Plugin to mount the Carbon Pilot REST API in development
function carbonPilotApiPlugin() {
  return {
    name: 'carbon-pilot-api-middleware',
    async configureServer(server) {
      const { createApiServer } = await import('./server/server.mjs');
      const apiHandler = createApiServer();
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/api')) {
          apiHandler.emit('request', req, res);
        } else {
          next();
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    carbonPilotApiPlugin()
  ],
  server: {
    port: 5180,
    host: true
  }
})
