import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

export const checkoutSchema = z
  .object({
    successUrl: z.string().url('Invalid success url'),
    cancelUrl: z.string().url('Invalid cancel url'),
    cart: z.boolean().optional(),
    product: z
      .object({
        id: z.string().refine((id) => isValidObjectId(id)),
        quantity: z.number().min(0).max(100_000)
      })
      .optional()
  })
  .refine(
    (data) => {
      if (!data.cart && !data.product) return false;
      return true;
    },
    { message: 'One of cart or product must be specified on checkout' }
  );
export type CheckoutSchema = z.infer<typeof checkoutSchema>;
