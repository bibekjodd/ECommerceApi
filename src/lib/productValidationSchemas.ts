import { z } from "zod";
export const productSchema = z.object({
  title: z.string().min(4),
  description: z.string().min(4).optional(),
  price: z.number().min(0).positive(),
  stock: z.number().min(1).positive(),
  category: z.string().min(4),
  discountRate: z.number().optional(),
  images: z.string().array().optional(),
  tags: z.array(z.string()).optional(),
  ram: z.number().optional(),
  sizes: z.array(z.string()).optional(),
  colors: z
    .array(
      z.object({
        code: z.string().optional(),
        value: z.string(),
      })
    )
    .optional(),
});

export type ProductValidationBody = z.infer<typeof productSchema>;

export const updateProductSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().min(0).positive().optional(),
  stock: z.number().min(1).positive().optional(),
  category: z.string().min(4).optional(),
  discountRate: z.number().optional(),
  images: z
    .object({
      indexesToDelete: z.array(z.number()),
      add: z.array(z.string()),
    })
    .optional(),
  tags: z.array(z.string()).optional(),
  ram: z.number().optional(),
  sizes: z.array(z.string()).optional(),
  colors: z
    .array(
      z.object({
        code: z.string().optional(),
        value: z.string(),
      })
    )
    .optional(),
});
export type UpdateProductValidationBody = z.infer<typeof updateProductSchema>;
