import { Document, Model, Query, Schema, Types, model } from 'mongoose';

export type ProductSchema = {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  title: string;
  description: Types.Array<string>;
  price: number;
  featured: boolean;
  features: Types.Array<string>;
  brand?: string;
  discountRate: number;
  ratings: number;
  tags: Types.Array<string>;
  sizes: Types.Array<string>;
  colors: Types.DocumentArray<Color>;
  image: Image;
  category: string;
  stock: number;
  numOfReviews: number;
  owner: Types.ObjectId;
};
type Color = { code: string; value: string };
type Image = { public_id: string; url: string };

const productSchema = new Schema<ProductSchema, Model<ProductSchema>>(
  {
    title: {
      type: String,
      required: [true, 'Please Enter product Name'],
      trim: true,
      maxlength: [100, 'Too long product title!']
    },
    description: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: [500, 'Too long product description!']
        }
      ],
      transform: (value: string[]) => {
        return value.slice(0, 10);
      }
    },
    price: {
      type: Number,
      required: [true, 'Please provide product Price'],
      max: [100000, 'Price must not exceed 100000']
    },
    featured: {
      type: Boolean,
      default: false
    },
    features: {
      type: [{ type: String, trim: true }],
      transform: (value: string[]) => {
        return value.slice(0, 10);
      }
    },
    brand: { type: String, trim: true, lowercase: true },
    discountRate: {
      type: Number,
      max: 100,
      min: 0,
      default: 0
    },
    ratings: {
      type: Number,
      default: 0
    },
    tags: {
      type: [{ type: String, trim: true, lowercase: true }],
      transform: (value: string[]) => {
        return value.slice(0, 5);
      }
    },
    sizes: {
      type: [
        {
          type: String,
          trim: true
        }
      ],
      transform: (value: string[]) => {
        const validSizes = ['sm', 'md', 'lg', 'xl', '2xl'];
        const newSizes = value.filter((size) => validSizes.includes(size));
        return newSizes;
      }
    },
    colors: {
      type: [
        {
          code: { type: String, trim: true },
          value: { type: String, trim: true }
        }
      ],
      transform: (value: Color[]) => {
        return value.slice(0, 5);
      }
    },
    image: {
      url: String,
      public_id: String
    },
    category: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'Please Enter Product Category']
    },
    stock: {
      type: Number,
      required: [true, 'Please Enter product Stock'],
      min: [1, 'At least 1 stock must be available initially'],
      max: [1000, 'Stocks must not exceed 1000 quantities'],
      default: 1
    },
    numOfReviews: {
      type: Number,
      default: 0
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },

  { timestamps: true }
);

export type TProduct = Document & ProductSchema;

const Product = model<ProductSchema, Model<ProductSchema>>(
  'Product',
  productSchema
);
export default Product;

export type QueryProduct = Query<ProductSchema[], ProductSchema>;
