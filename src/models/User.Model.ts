import { Model, Schema, Types, model, type Document } from 'mongoose';
import { z } from 'zod';

type UserSchema = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string | undefined;
  image?: string;
  emailVerified: boolean;
  isGoogleUser: boolean;
  role: 'user' | 'admin';
  resetPasswordToken?: string;
  resetPasswordExpire?: number;
  createdAt: string;
  updatedAt: string;
};

const userSchema = new Schema<UserSchema, Model<UserSchema>>(
  {
    name: {
      type: String,
      required: [true, 'Name is mandatory field'],
      trim: true,
      minLength: [4, 'Name must be at least 4 characters'],
      maxLength: [30, 'Name should not exceed 30 characters'],
      transform(name: string) {
        return name.split(' ').slice(0, 3).join(' ').trim();
      }
    },
    email: {
      type: String,
      required: [true, 'Email is mandatory field'],
      maxLength: [30, 'Email should not exceed 30 characters'],
      validate: [
        (email: string) => {
          return z.string().email().safeParse(email).success;
        },
        'Must provide valid email'
      ],
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      select: false,
      minLength: [6, 'Password must be at least 6 characters'],
      trim: true
    },
    image: { type: String },
    emailVerified: {
      type: Boolean,
      default: false
    },
    isGoogleUser: { type: Boolean },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Number, select: false }
  },
  { timestamps: true }
);

export const User = model<UserSchema, Model<UserSchema>>('User', userSchema);

export type TUser = UserSchema & Document<Types.ObjectId>;
