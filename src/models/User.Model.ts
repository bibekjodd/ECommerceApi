import { Schema, model, Types, type Model, type Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';
// import crypto from 'crypto';
import { env } from '../config/env.config';

export type IUser = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  avatar?: {
    public_id?: string;
    url?: string;
  };
  emailVerified: boolean;
  role: 'user' | 'admin';
  resetPasswordToken?: string;
  resetPasswordExpire?: number;
  createdAt: NativeDate;
  updatedAt: NativeDate;
};

type UserMethods = {
  comparePassword: (password: string) => Promise<boolean>;
  generateToken: () => string;
  getResetPasswordToken: () => string;
};

const userSchema = new Schema<IUser, Model<IUser>, UserMethods>(
  {
    name: {
      type: String,
      required: [true, 'Name is mandatory field'],
      trim: true,
      minLength: [4, 'Name must be at least 4 characters'],
      maxLength: [30, 'Name should not exceed 30 characters']
    },

    email: {
      type: String,
      required: [true, 'Email is mandatory field'],
      maxLength: [30, 'Email should not exceed 30 characters'],
      validate: [validator.isEmail, 'Must provide valid email'],
      trim: true
    },

    password: {
      type: String,
      required: [true, 'Password is mandatory field'],
      select: false,
      minLength: [6, 'Password must be at least 6 characters'],
      trim: true
    },

    avatar: {
      public_id: String,
      url: String
    },

    emailVerified: {
      type: Boolean,
      default: false
    },

    role: { type: String, default: 'user' },

    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password'))
    this.password = await bcrypt.hash(this.password || '', 10);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

userSchema.methods.getResetPasswordToken = function () {
  // const token = crypto.randomBytes(20).toString('hex');
  // this.resetPasswordToken = crypto
  //   .createHash('sha256')
  //   .update(token)
  //   .digest('hex');
  const token = 'todo';
  this.resetPasswordExpire = Date.now() + 15 * 60 * 60 * 1000;
  return token;
};

const User = model('User', userSchema);
export default User;

export type TUser = IUser & UserMethods & Document;
