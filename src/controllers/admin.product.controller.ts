import { validateProduct, validateUpdateProduct } from "../lib/validateProduct";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import Product from "../models/Product.Model";
import { ErrorHandler } from "../lib/errorHandler";
import { deleteImage, uploadImage } from "../lib/cloudinary";
import {
  ProductValidationBody,
  UpdateProductValidationBody,
} from "../lib/productValidationSchemas";

export const createProduct = catchAsyncError<
  unknown,
  unknown,
  ProductValidationBody
>(async (req, res) => {
  validateProduct(req.body);

  const { images, ...productDetails } = req.body;
  let product = new Product({
    ...productDetails,
    owner: req.user._id,
  });

  product.tags = product.tags.slice(0, 5);
  switch (product.category) {
    case "mobile":
      break;
    case "laptop":
      break;
    case "electronics":
      break;
    default:
      delete product["ram"];
  }
  product.sizes = product.sizes.filter((size) => {
    return (
      size === "sm" ||
      size === "md" ||
      size === "lg" ||
      size === "xl" ||
      size === "2xl"
    );
  });
  product.colors = product.colors.slice(0, 7);

  if (images) {
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
  UpdateProductValidationBody
>(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return next(new ErrorHandler("Product with this id doesn't exist", 400));

  validateUpdateProduct(req.body);

  const { images, ...productDetails } = req.body;
  for (const key of Object.keys(productDetails)) {
    // @ts-ignore
    product[key] = productDetails[key];
  }

  if (images) {
    let delIndex = 0;
    for (const image of images.add.slice(0, 5)) {
      await deleteImage(
        product.images[images.indexesToDelete[delIndex]]?.public_id
      );
      const res = await uploadImage(image);
      if (res) {
        product.images[images.indexesToDelete[delIndex]] = {
          public_id: res.public_id,
          url: res.url,
        };
      }
    }
    delIndex++;
  }

  await product.save();
  res.status(200).json({ message: "Product updated successfully" });
});

export const deleteProduct = catchAsyncError<{ id: string }>(
  async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product deleted successfully" });
  }
);

export const getProductDetails = catchAsyncError<{ id: string }>(
  async (req, res, next) => {
    const product = await Product.findById(req.params.id)
      .populate("owner")
      .populate("reviews");

    if (!product)
      return next(new ErrorHandler("Product with this id doens't exist", 400));

    res.status(200).json({ product });
  }
);
