import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import { config } from './config/config';
import { propertyRoutes } from './routes/property.routes';
import { reservationRoutes } from './routes/reservation.routes';
import { healthRoutes } from './routes/health.routes';
import { usageTrackingPlugin, flushPendingReports } from './middleware/usage-tracking';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

const server = Fastify({
  logger: {
    level: config.logLevel,
    transport: config.isDevelopment
      ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  },
});

// Register plugins
server.register(cors, {
  origin: config.corsOrigins,
  credentials: true,
});

server.register(helmet, {
  contentSecurityPolicy: config.isDevelopment ? false : undefined,
});

server.register(jwt, {
  secret: config.jwtSecret,
});

// Usage tracking middleware
server.register(usageTrackingPlugin);

// Decorate fastify with prisma instance
server.decorate('prisma', prisma);

// Health check routes
server.register(healthRoutes, { prefix: '/health' });

// API routes
server.register(propertyRoutes, { prefix: '/api/v1/properties' });
server.register(reservationRoutes, { prefix: '/api/v1/reservations' });

// Graceful shutdown
const gracefulShutdown = async () => {
  server.log.info('Received shutdown signal, closing connections...');
  await flushPendingReports();
  await prisma.$disconnect();
  await server.close();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const start = async () => {
  try {
    await server.listen({
      port: config.port,
      host: config.host,
    });

    server.log.info(
      `🚀 Property Management Service running on http://${config.host}:${config.port}`
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

// Type declaration for FastifyInstance with prisma
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
