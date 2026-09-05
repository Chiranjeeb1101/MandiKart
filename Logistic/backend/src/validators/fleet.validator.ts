import { z } from 'zod';

export const registerVehicleSchema = z.object({
  vehicleNumber: z
    .string({ required_error: 'Vehicle number is required' })
    .min(5, 'Vehicle number too short')
    .max(15, 'Vehicle number too long')
    .toUpperCase(),
  type: z.enum(
    ['Tata Ace', 'Tata 407', 'Mahindra Bolero Pickup', 'Ashok Leyland Dost', 'Mini Truck', 'Large Truck'],
    { required_error: 'Vehicle type is required' }
  ),
  capacityKg: z
    .number({ required_error: 'Capacity in kg is required' })
    .int('Capacity must be a whole number')
    .min(100, 'Minimum capacity is 100 kg')
    .max(10000, 'Maximum capacity is 10,000 kg'),
  driverId: z.string().optional(),
});

export type RegisterVehicleInput = z.infer<typeof registerVehicleSchema>;
