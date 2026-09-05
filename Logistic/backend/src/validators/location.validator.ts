import { z } from 'zod';

export const updateLocationSchema = z.object({
  lat: z
    .number({ required_error: 'Latitude is required' })
    .min(-90, 'Latitude must be >= -90')
    .max(90, 'Latitude must be <= 90'),
  lng: z
    .number({ required_error: 'Longitude is required' })
    .min(-180, 'Longitude must be >= -180')
    .max(180, 'Longitude must be <= 180'),
  speed: z
    .number()
    .min(0, 'Speed cannot be negative')
    .max(200, 'Speed cannot exceed 200 km/h')
    .nullable()
    .optional()
    .default(0),
  heading: z
    .number()
    .min(0, 'Heading must be 0–360')
    .max(360, 'Heading must be 0–360')
    .nullable()
    .optional(),
  orderId: z.string().nullable().optional(),
});

export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
