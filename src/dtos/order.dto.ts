import { z } from 'zod';

export const cancelOrderSchema = z.object({
  reason: z
    .string()
    .max(500, "Order cancellation remark can't be more than 500 characters")
    .optional()
});

export const getOrdersSchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((value) => {
      const limit = Number(value) || 10;
      if (limit < 1 || limit > 10) return 10;
      return limit;
    }),
  cursor: z
    .string()
    .datetime()
    .optional()
    .transform((value) => value || new Date().toISOString())
});

export const getOrdersOnMyProductsSchema = getOrdersSchema;
