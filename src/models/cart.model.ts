import { Model, Schema, Types, model } from 'mongoose';

type CartSchema = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
  createdAt: NativeDate;
  updatedAt: NativeDate;
};

const cartSchema = new Schema<CartSchema, Model<CartSchema>>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product id is not provided']
    },
    quantity: {
      type: Number,
      max: [1000, "There can't be more than 1000 quantities of same item on the cart"],
      min: [1, 'At least 1 quantity is required to add item on the cart'],
      default: 1,
      transform(quantity: number) {
        return Math.round(quantity);
      }
    }
  },
  { timestamps: true }
);

export const Cart = model<CartSchema, Model<CartSchema>>('Cart', cartSchema);

let cartProperties = '';
cartSchema.eachPath((path) => {
  cartProperties += ' ';
  cartProperties += path;
});
export const selectCartProperties = cartProperties;
