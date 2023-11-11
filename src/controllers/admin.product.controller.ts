import { uploadImage } from '@/lib/cloudinary';
import { CustomError } from '@/lib/customError';
import { isStringArray } from '@/lib/validators';
import { catchAsyncError } from '@/middlewares/catchAsyncError';
import Product, { type IProduct } from '@/models/product.model';

export type CreateProductBody = Omit<Partial<IProduct>, 'images'> & {
  images?: string[];
};
export const createProduct = catchAsyncError<
  unknown,
  unknown,
  CreateProductBody
>(async (req, res) => {
  const { images, ...productDetails } = req.body;
  let product = new Product({
    ...productDetails,
    owner: req.user._id
  });

  if (images && isStringArray(images)) {
    for (const image of images.slice(0, 5)) {
      const res = await uploadImage(image);
      if (res)
        product.images.push({
          public_id: res.public_id,
          url: res.url
        });
    }
  }

  product = await product.save();

  return res
    .status(201)
    .json({ product, message: 'Product created successfully' });
});

type UpdateProductBody = Omit<Partial<IProduct>, 'images'> & {
  images?: {
    indexesToDelete?: Array<number>;
    add?: string[];
  };
};
export const updateProduct = catchAsyncError<
  { id: string },
  unknown,
  UpdateProductBody
>(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new CustomError("Product doesn't exist", 400);

  const { images, ...productDetails } = req.body;
  for (const key of Object.keys(productDetails)) {
    // @ts-ignore
    product[key] = productDetails[key];
  }

  // todo: update images

  await product.save();
  return res.json({ message: 'Product updated successfully' });
});

export const deleteProduct = catchAsyncError<{ id: string }>(
  async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);

    return res.json({ message: 'Product deleted successfully' });
  }
);
