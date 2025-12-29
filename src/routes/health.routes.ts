import { FastifyInstance } from 'fastify';

export async function healthRoutes(server: FastifyInstance) {
  server.get('/', async (request, reply) => {
    return {
      status: 'healthy',
      service: 'property-management',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  server.get('/ready', async (request, reply) => {
    try {
      await server.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ready',
        database: 'connected',
      };
    } catch (error) {
      reply.code(503);
      return {
        status: 'not_ready',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });
}
