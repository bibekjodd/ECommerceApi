import { catchAsyncError } from "../middlewares/catchAsyncError";
import Product from "../models/product.model";
import { CustomError } from "../lib/customError";
import { deleteImage, uploadImage } from "../lib/cloudinary";
import { CreateProductBody, UpdateProductBody } from "../types/product";
import { isNumberArray, isStringArray } from "../lib/validators";

export const createProduct = catchAsyncError<
  unknown,
  unknown,
  CreateProductBody
>(async (req, res) => {
  const { images, ...productDetails } = req.body;
  let product = new Product({
    ...productDetails,
    owner: req.user._id,
  });

  if (images && isStringArray(images)) {
    for (const image of images.slice(0, 5)) {
      const res = await uploadImage(image);
      if (res)
        product.images.push({
          public_id: res.public_id,
          url: res.url,
        });
    }
  }

  product = await product.save();

  return res
    .status(201)
    .json({ product, message: "Product created successfully" });
});

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

  if (
    images &&
    images.add &&
    images.indexesToDelete &&
    isStringArray(images.add) &&
    isNumberArray(images.add)
  ) {
    let delIndex = 0;
    for (const image of images.add.slice(0, 5)) {
      await deleteImage(
        product.images[images.indexesToDelete[delIndex]]?.public_id || ""
      );
      const res = await uploadImage(image);
      if (res) {
        product.images[images.indexesToDelete[delIndex]].public_id =
          res.public_id;
        product.images[images.indexesToDelete[delIndex]].url = res.url;
      }
    }
    delIndex++;
  }

  await product.save();
  return res.json({ message: "Product updated successfully" });
});

export const deleteProduct = catchAsyncError<{ id: string }>(
  async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);

    return res.json({ message: "Product deleted successfully" });
  }
);
