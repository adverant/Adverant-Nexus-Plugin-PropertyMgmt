import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PropertyService } from '../services/property.service';

export class PropertyController {
  private propertyService: PropertyService;

  constructor(private server: FastifyInstance) {
    this.propertyService = new PropertyService(server.prisma);
  }

  async listProperties(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { page = 1, limit = 20, status, ownerId, managerId } = request.query as any;

      const result = await this.propertyService.listProperties({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        ownerId,
        managerId,
      });

      return reply.send(result);
    } catch (error) {
      this.server.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getProperty(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };

      const property = await this.propertyService.getProperty(id);

      if (!property) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'Property not found',
        });
      }

      return reply.send(property);
    } catch (error) {
      this.server.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async createProperty(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.user as any;
      const data = request.body as any;

      const property = await this.propertyService.createProperty({
        ...data,
        ownerId: data.ownerId || user.userId,
        managerId: data.managerId || user.userId,
      });

      return reply.code(201).send(property);
    } catch (error) {
      this.server.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async updateProperty(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const data = request.body as any;

      const property = await this.propertyService.updateProperty(id, data);

      return reply.send(property);
    } catch (error) {
      this.server.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async deleteProperty(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };

      await this.propertyService.deleteProperty(id);

      return reply.code(204).send();
    } catch (error) {
      this.server.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getAvailability(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const { startDate, endDate } = request.query as any;

      const availability = await this.propertyService.getAvailability(
        id,
        new Date(startDate),
        new Date(endDate)
      );

      return reply.send(availability);
    } catch (error) {
      this.server.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async getStatistics(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };

      const statistics = await this.propertyService.getStatistics(id);

      return reply.send(statistics);
    } catch (error) {
      this.server.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
