import { ErrorHandler } from "./errorHandler";
import {
  ProductValidationBody,
  UpdateProductValidationBody,
  productSchema,
  updateProductSchema,
} from "./productValidationSchemas";

export function validateProduct(product: ProductValidationBody) {
  try {
    productSchema.parse(product);
  } catch (error) {
    throw new ErrorHandler("Product validation failed", 400);
  }
}

export function validateUpdateProduct(product: UpdateProductValidationBody) {
  try {
    updateProductSchema.parse(product);
  } catch (error) {
    throw new ErrorHandler("Product validation failed", 400);
  }
}
