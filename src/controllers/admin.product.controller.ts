import validateProduct, { ProductBody } from "../lib/validateProduct";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import Product from "../models/Product.Model";
import { ErrorHandler } from "../lib/errorHandler";
import cloudinary from "cloudinary";

export const createProduct = catchAsyncError<unknown, unknown, ProductBody>(
  async (req, res, next) => {
    if (!validateProduct(req.body))
      return next(
        new ErrorHandler("Please enter valid data on product field", 400)
      );

    const { images, ...productDetails } = req.body;
    let product = new Product({
      ...productDetails,
      owner: req.user._id,
    });

    if (images) {
      for (const image of images) {
        try {
          const { public_id, secure_url } = await cloudinary.v2.uploader.upload(
            image,
            { folder: "ecomapi/productimages" }
          );
          product.images.push({ public_id, url: secure_url });
        } catch (err) {
          //
        }
      }
    }

    product = await product.save();

    return res
      .status(201)
      .json({ product, message: "Product created successfully" });
  }
);

export const updateProduct = catchAsyncError<
  { id: string },
  unknown,
  Partial<ProductBody>
>(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return next(new ErrorHandler("Product with this id doesn't exist", 400));

  const { images, category, price, stock, title, description } = req.body;
  if (category) product.category = category;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (title) product.title = title;
  if (description) product.description = description;

  if (images) {
    for (const image of images) {
      try {
        const { public_id, secure_url } = await cloudinary.v2.uploader.upload(
          image,
          { folder: "ecomapi/productimages" }
        );
        product.images.push({
          public_id,
          url: secure_url,
        });
      } catch (err) {
        //
      }
    }
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
