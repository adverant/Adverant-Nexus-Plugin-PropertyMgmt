import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ReservationService } from '../services/reservation.service';

export class ReservationController {
  private reservationService: ReservationService;

  constructor(private server: FastifyInstance) {
    this.reservationService = new ReservationService(server.prisma);
  }

  async listReservations(request: FastifyRequest, reply: FastifyReply) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        propertyId,
        guestId,
        checkInFrom,
        checkInTo,
      } = request.query as any;

      const result = await this.reservationService.listReservations({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        propertyId,
        guestId,
        checkInFrom: checkInFrom ? new Date(checkInFrom) : undefined,
        checkInTo: checkInTo ? new Date(checkInTo) : undefined,
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

  async getReservation(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };

      const reservation = await this.reservationService.getReservation(id);

      if (!reservation) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'Reservation not found',
        });
      }

      return reply.send(reservation);
    } catch (error) {
      this.server.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async createReservation(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = request.body as any;

      const reservation = await this.reservationService.createReservation(data);

      return reply.code(201).send(reservation);
    } catch (error) {
      this.server.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async updateReservation(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const data = request.body as any;

      const reservation = await this.reservationService.updateReservation(id, data);

      return reply.send(reservation);
    } catch (error) {
      this.server.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async cancelReservation(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const { reason } = request.body as any;

      const reservation = await this.reservationService.cancelReservation(id, reason);

      return reply.send(reservation);
    } catch (error) {
      this.server.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async checkIn(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };

      const reservation = await this.reservationService.checkIn(id);

      return reply.send(reservation);
    } catch (error) {
      this.server.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async checkOut(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };

      const reservation = await this.reservationService.checkOut(id);

      return reply.send(reservation);
    } catch (error) {
      this.server.log.error(error);
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
