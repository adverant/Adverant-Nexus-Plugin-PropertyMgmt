import { FastifyInstance } from 'fastify';
import { PropertyController } from '../controllers/property.controller';
import { authenticate } from '../middleware/auth.middleware';
import { createPropertySchema, updatePropertySchema } from '../schemas/property.schema';

export async function propertyRoutes(server: FastifyInstance) {
  const controller = new PropertyController(server);

  // Get all properties (with filters and pagination)
  server.get('/', {
    onRequest: [authenticate],
  }, controller.listProperties.bind(controller));

  // Get property by ID
  server.get('/:id', {
    onRequest: [authenticate],
  }, controller.getProperty.bind(controller));

  // Create property
  server.post('/', {
    onRequest: [authenticate],
    schema: {
      body: createPropertySchema,
    },
  }, controller.createProperty.bind(controller));

  // Update property
  server.put('/:id', {
    onRequest: [authenticate],
    schema: {
      body: updatePropertySchema,
    },
  }, controller.updateProperty.bind(controller));

  // Delete property
  server.delete('/:id', {
    onRequest: [authenticate],
  }, controller.deleteProperty.bind(controller));

  // Get property availability
  server.get('/:id/availability', {
    onRequest: [authenticate],
  }, controller.getAvailability.bind(controller));

  // Get property statistics
  server.get('/:id/statistics', {
    onRequest: [authenticate],
  }, controller.getStatistics.bind(controller));
}
