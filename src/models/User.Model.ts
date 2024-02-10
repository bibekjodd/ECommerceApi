import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Schema, Types, model, type Document, type Model } from 'mongoose';
import { z } from 'zod';

export type UserSchema = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string | undefined;
  image?: string;
  emailVerified: boolean;
  role: 'user' | 'admin';
  resetPasswordToken?: string;
  resetPasswordExpire?: number;
  createdAt: NativeDate;
  updatedAt: NativeDate;
};

type UserMethods = {
  comparePassword: (password: string) => Promise<boolean>;
  getResetPasswordToken: () => string;
};

const userSchema = new Schema<UserSchema, Model<UserSchema>, UserMethods>(
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
      required: [true, 'Password is mandatory field'],
      select: false,
      minLength: [6, 'Password must be at least 6 characters'],
      trim: true
    },
    image: String,
    emailVerified: {
      type: Boolean,
      default: false
    },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Number }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password'))
    this.password = await bcrypt.hash(this.password || '', 10);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  const isMatch = await bcrypt.compare(password, this.password || '');
  return isMatch;
};

userSchema.methods.getResetPasswordToken = function () {
  const token = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 15 * 60 * 60 * 1000;
  return token;
};

export const User = model('User', userSchema);
// export default User;

export type TUser = UserSchema & UserMethods & Document<Types.ObjectId>;
