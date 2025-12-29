import { z } from 'zod';

export const createReservationSchema = z.object({
  propertyId: z.string().uuid(),
  unitId: z.string().uuid().optional(),
  guestId: z.string().uuid(),
  channel: z.enum(['AIRBNB', 'VRBO', 'BOOKING_COM', 'EXPEDIA', 'DIRECT', 'OTHER']),
  channelReservationId: z.string().optional(),
  checkInDate: z.string().datetime(),
  checkOutDate: z.string().datetime(),
  guests: z.number().int().min(1),
  pricing: z.object({
    nightlyRate: z.number().min(0),
    nights: z.number().int().min(1),
    cleaningFee: z.number().min(0),
    serviceFee: z.number().min(0),
    taxes: z.number().min(0),
    total: z.number().min(0),
  }),
  guestInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    specialRequests: z.string().optional(),
  }).optional(),
});

export const updateReservationSchema = createReservationSchema.partial();
