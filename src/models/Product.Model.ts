import { imageSchema } from '@/dtos/common.dto';
import { Document, Model, Query, Schema, Types, model } from 'mongoose';

type ProductSchema = {
  _id: Types.ObjectId;
  createdAt: string;
  updatedAt: string;
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
        description = description.filter((desc) => desc !== '');
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
      transform: (features?: { title: string; text: string }[]) => {
        if (!features) return undefined;
        features = features.filter((feature) => feature.text !== '' && feature.title !== '');
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
      transform: (tags?: string[]) => {
        if (!tags) return undefined;
        tags = tags.filter((tag) => tag !== '');
        tags = tags.slice(0, 5);
        tags = tags.map((tag) => tag.slice(0, 20));
        return tags;
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
      transform: (variants: string[]) => {
        variants = variants.filter((variant) => variant !== '');
        variants = variants.slice(0, 10);
        variants = variants.map((variant) => variant.slice(0, 20));
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
      transform: (colors?: Color[]) => {
        if (!colors) return undefined;
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
      maxlength: 150,
      validate: [
        (value: string) => {
          if (!value) return true;
          return imageSchema.safeParse(value).success;
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
      min: 0,
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

export const Product = model<ProductSchema, Model<ProductSchema>>('Product', productSchema);

export type QueryProduct = Query<ProductSchema[], ProductSchema>;

let productProperties = '';
productSchema.eachPath((path) => {
  productProperties += ' ';
  productProperties += path;
});

export const selectProductProperties = productProperties;
