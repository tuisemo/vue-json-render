import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

// Custom plugin to handle API routes
function apiRoutes() {
  return {
    name: 'api-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Handle /api/generate endpoint
        if (req.url?.startsWith('/api/generate') && req.method === 'POST') {
          try {
            // Import the route handler using absolute path
            const routePath = join(__dirname, 'src/app/api/generate/route.ts');
            const route = (await import(routePath)) as any;

            // Parse request body
            const chunks: Buffer[] = [];
            for await (const chunk of req as any) {
              chunks.push(chunk);
            }
            const body = Buffer.concat(chunks).toString();

            // Call the POST handler
            const response = await route.POST({ json: async () => JSON.parse(body) } as Request);
            const data = await response.text();

            // Set headers and send response
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = response.status;
            res.end(data);
          } catch (error) {
            console.error('API Error:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal server error' }));
          }
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [vue(), apiRoutes()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
  },
});
