import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import type { AddressInfo } from 'net';
import swaggerUi from 'swagger-ui-express';
import { connectDatabase, disconnectDatabase } from './infrastructure/database/connection';
import { swaggerSpec } from './infrastructure/swagger/config';
import authRoutes from './interface/routes/auth.routes';
import leadRoutes from './interface/routes/lead.routes';
import { seedIfEmpty } from './infrastructure/database/seedHelper';

const app = express();
const PORT = Number(process.env.PORT || 5000);

// Middleware
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(url => url.trim());

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed) || allowed === '*')) {
      return callback(null, true);
    }
    // In production, also allow any vercel.app subdomain
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(null, false);
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'GigFlow API Docs',
}));

// Root route for easier manual verification in the browser
app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'GigFlow API is running',
    endpoints: {
      health: '/api/health',
      docs: '/api-docs',
      auth: '/api/auth',
      leads: '/api/leads',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'GigFlow API' });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();

    // Auto-seed if database is empty (useful for memory-server mode)
    await seedIfEmpty();

    const server = app.listen(PORT, () => {
      const address = server.address() as AddressInfo | null;
      const activePort = address?.port ?? PORT;

      console.log(`\n🚀 GigFlow API Server running on http://localhost:${activePort}`);
      console.log(`📖 Swagger Docs: http://localhost:${activePort}/api-docs`);
      console.log(`🔑 Health Check: http://localhost:${activePort}/api/health\n`);
    });

    server.on('error', async (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Stop the other server process or change PORT in your environment.`);
      } else {
        console.error('❌ Server failed to start:', error);
      }

      await disconnectDatabase();
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to initialize server:', error);
    await disconnectDatabase();
    process.exit(1);
  }
};

startServer();

export default app;
