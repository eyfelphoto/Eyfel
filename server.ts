import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Netlify Function handlers
import { handler as paytrTokenHandler } from './netlify/functions/paytr-token.ts';
import { handler as paytrCallbackHandler } from './netlify/functions/paytr-callback.ts';
import { handler as getSignedUrlHandler } from './netlify/functions/get-signed-url.ts';
import { handler as adminApiHandler } from './netlify/functions/admin-api.ts';

const app = express();
const PORT = 3000;

// Body parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.text({ type: '*/*', limit: '20mb' }));

// Netlify Function Adapter
const runHandler = (handler: any) => async (req: express.Request, res: express.Response) => {
  try {
    let bodyStr = '';
    if (typeof req.body === 'string') {
      bodyStr = req.body;
    } else if (req.body && typeof req.body === 'object') {
      if (req.is('application/x-www-form-urlencoded')) {
        bodyStr = new URLSearchParams(req.body).toString();
      } else {
        bodyStr = JSON.stringify(req.body);
      }
    }

    const event = {
      httpMethod: req.method,
      headers: req.headers as Record<string, string>,
      queryStringParameters: (req.query as Record<string, string>) || {},
      body: bodyStr,
    };

    const response = await handler(event, {} as any);
    if (response.headers) {
      for (const [key, val] of Object.entries(response.headers)) {
        res.setHeader(key, val as string);
      }
    }
    res.status(response.statusCode || 200).send(response.body);
  } catch (error: any) {
    console.error('Netlify function adapter error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// Map API endpoints to Netlify handlers
const functionMap: Record<string, any> = {
  'paytr-token': paytrTokenHandler,
  'paytr-callback': paytrCallbackHandler,
  'get-signed-url': getSignedUrlHandler,
  'admin-api': adminApiHandler,
};

// Route handlers for /api/* and /.netlify/functions/*
Object.entries(functionMap).forEach(([name, handler]) => {
  app.all(`/api/${name}`, runHandler(handler));
  app.all(`/.netlify/functions/${name}`, runHandler(handler));
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve production build
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Development mode: mount Vite dev server middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
