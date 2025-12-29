import { FastifyInstance } from 'fastify';
import { ReservationController } from '../controllers/reservation.controller';
import { authenticate } from '../middleware/auth.middleware';
import { createReservationSchema, updateReservationSchema } from '../schemas/reservation.schema';

export async function reservationRoutes(server: FastifyInstance) {
  const controller = new ReservationController(server);

  // Get all reservations
  server.get('/', {
    onRequest: [authenticate],
  }, controller.listReservations.bind(controller));

  // Get reservation by ID
  server.get('/:id', {
    onRequest: [authenticate],
  }, controller.getReservation.bind(controller));

  // Create reservation
  server.post('/', {
    onRequest: [authenticate],
    schema: {
      body: createReservationSchema,
    },
  }, controller.createReservation.bind(controller));

  // Update reservation
  server.put('/:id', {
    onRequest: [authenticate],
    schema: {
      body: updateReservationSchema,
    },
  }, controller.updateReservation.bind(controller));

  // Cancel reservation
  server.post('/:id/cancel', {
    onRequest: [authenticate],
  }, controller.cancelReservation.bind(controller));

  // Check-in
  server.post('/:id/checkin', {
    onRequest: [authenticate],
  }, controller.checkIn.bind(controller));

  // Check-out
  server.post('/:id/checkout', {
    onRequest: [authenticate],
  }, controller.checkOut.bind(controller));
}
