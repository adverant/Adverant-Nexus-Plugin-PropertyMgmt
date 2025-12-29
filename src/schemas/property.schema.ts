import { z } from 'zod';

export const createPropertySchema = z.object({
  name: z.string().min(1).max(255),
  propertyType: z.enum([
    'APARTMENT', 'HOUSE', 'VILLA', 'CONDO', 'TOWNHOUSE',
    'CABIN', 'COTTAGE', 'LOFT', 'STUDIO', 'OTHER'
  ]),
  description: z.string().optional(),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().default('US'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().min(0),
  maxGuests: z.number().int().min(1),
  baseGuests: z.number().int().min(1).default(2),
  squareFeet: z.number().int().optional(),
  checkInTime: z.string().default('15:00'),
  checkOutTime: z.string().default('11:00'),
  amenities: z.array(z.string()).default([]),
  houseRules: z.record(z.any()).default({}),
  basePrice: z.number().min(0),
  cleaningFee: z.number().min(0),
  securityDeposit: z.number().min(0),
  photos: z.array(z.string()).default([]),
});

export const updatePropertySchema = createPropertySchema.partial();
