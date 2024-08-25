import { z } from 'zod';

export const addToCartSchema = z.object({
  quantity: z
    .number()
    .max(1000, "There can't be more than 1000 quantities of same item on the cart")
    .min(1, 'At least 1 quantity is required to add item on the cart')
    .default(1)
});
