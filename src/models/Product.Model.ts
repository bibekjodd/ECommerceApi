import { imageSchema } from '@/dtos/common.dto';
import { Document, Model, Query, Schema, Types, model } from 'mongoose';

export type ProductSchema = {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  title: string;
  description: Types.Array<string>;
  price: number;
  featured: boolean;
  features: Types.DocumentArray<{ title: string; text: string }>;
  brand?: string;
  discountRate: number;
  ratings: number;
  tags: Types.Array<string>;
  variants: Types.Array<string>;
  colors: Types.DocumentArray<Color>;
  image: string;
  category: string;
  stock: number;
  numOfReviews: number;
  owner: Types.ObjectId;
};
type Color = { title: string; code: string };

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
      transform: (description: string[]) => {
        description = description.slice(0, 10);
        description = description.map((value) => value.trim().slice(0, 200));
        return description;
      }
    },
    price: {
      type: Number,
      required: [true, 'Please provide product Price'],
      max: [100_000, 'Price must not exceed 100000']
    },
    featured: {
      type: Boolean,
      default: false
    },
    features: {
      type: [
        {
          title: { type: String, required: true },
          text: { type: String, required: true }
        }
      ],
      transform: (features: { title: string; text: string }[]) => {
        features = features.slice(0, 10);
        features = features.map((feature) => ({
          title: feature.title.trim().slice(0, 20),
          text: feature.title.trim().slice(0, 50)
        }));
        return features;
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
    variants: {
      type: [
        {
          type: String,
          trim: true,
          lowercase: true
        }
      ],
      transform: (value: string[]) => {
        const variants = value.map((size) => size.slice(0, 20));
        return variants;
      }
    },
    colors: {
      type: [
        {
          title: { type: String, trim: true },
          code: { type: String, trim: true }
        }
      ],
      transform: (colors: Color[]) => {
        colors = colors?.slice(0, 5) || [];
        colors = colors.map(({ code, title }) => ({
          code: code.slice(0, 10),
          title: title.slice(0, 10)
        }));
        return colors;
      }
    },
    image: {
      type: String,
      maxlength: 100,
      validate: [
        (value: string) => {
          if (!value) return true;
          if (imageSchema.safeParse(value).success) return true;
          return false;
        },
        'Invalid image url'
      ]
    },
    category: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, 'Please Enter Product Category'],
      maxlength: 100
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

export const Product = model<ProductSchema, Model<ProductSchema>>(
  'Product',
  productSchema
);

export type QueryProduct = Query<ProductSchema[], ProductSchema>;
