import { uploadProductImage } from '@/lib/image-services';
import { CustomError } from '@/lib/custom-error';
import { cascadeOnDeleteProduct } from '@/lib/db-actions';
import { catchAsyncError } from '@/middlewares/catch-async-error';
import Product, { type TProduct } from '@/models/product.model';

export type CreateProductBody = Partial<TProduct> & {
  imageDataUri?: string;
};
export const createProduct = catchAsyncError<
  unknown,
  unknown,
  CreateProductBody
>(async (req, res) => {
  const { imageDataUri, ...productDetails } = req.body;
  let product = new Product({
    ...productDetails,
    owner: req.user._id
  });

  if (imageDataUri) {
    const res = await uploadProductImage(imageDataUri);
    if (res) product.image = res;
  }

  product = await product.save();

  return res
    .status(201)
    .json({ product, message: 'Product created successfully' });
});

type UpdateProductBody = Partial<TProduct> & {
  imageDataUri?: string;
};
export const updateProduct = catchAsyncError<
  { id: string },
  unknown,
  UpdateProductBody
>(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new CustomError("Product doesn't exist", 400);
  const { imageDataUri, ...productDetails } = req.body;
  if (imageDataUri) {
    const res = await uploadProductImage(imageDataUri);
    if (res) product.image = res;
  }

  const validUpdateProperties = [
    'title',
    'description',
    'price',
    'features',
    'featured',
    'brand',
    'discountRate',
    'sizes',
    'tags',
    'colors',
    'stock'
  ];

  for (const property of validUpdateProperties) {
    // @ts-ignore
    product[property] = productDetails[property] || product[property];
  }

  await product.save({ validateBeforeSave: true });
  return res.json({ message: 'Product updated successfully' });
});

export const deleteProduct = catchAsyncError<{ id: string }>(
  async (req, res) => {
    await cascadeOnDeleteProduct(req.params.id);
    return res.json({ message: 'Product deleted successfully' });
  }
);
