import { z } from 'zod';

export const getOrderStatsSchema = z.object({
  days: z.number().positive().min(1).max(365, "Stats can't be older than a year").default(30)
});

export const getSalesStatsSchema = getOrderStatsSchema;
