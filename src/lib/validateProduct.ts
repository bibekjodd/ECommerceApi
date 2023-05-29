import { z } from "zod";
const productBody = z.object({
  title: z.string().min(4),
  description: z.string().min(4).optional(),
  price: z.number().min(0).positive(),
  stock: z.number().min(1).positive(),
  category: z.string().min(4),
  images: z.string().array().optional(),
})

export type ProductBody = z.infer<typeof productBody>;

export default function validateProduct(product: ProductBody) {
  try {
    productBody.parse(product);
    return true;
  } catch (error) {
    return false;
  }
}
