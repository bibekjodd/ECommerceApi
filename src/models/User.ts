import mongoose, { InferSchemaType } from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is mandatory field"],
      trim: true,
      minLength: [4, "Name must be at least 4 characters"],
      maxLength: [30, "Name should not exceed 30 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is mandatory field"],
      minLength: [10, "Email must be at least 4 characters"],
      maxLength: [30, "Email should not exceed 30 characters"],
      validate: [validator.isEmail, "Must provide valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is mandatory field"],
      select: false,
      minLength: [6, "Password must be at least 6 characters"],
      trim: true,
    },

    avatar: {
      public_id: {
        type: String,
        default: "not_set",
      },
      url: {
        type: String,
        default: "not_set",
      },
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    role: { type: String, default: "user" },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * generates token of 20 bytes that expires after 15 minutes don't forget tosave after generating token
 */
userSchema.methods.getResetPasswordToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 60 * 1000;
  return token;
};

export interface IUser
  extends mongoose.Document,
    InferSchemaType<typeof userSchema> {
  comparePassword: (password: string) => Promise<boolean>;
  generateToken: () => string;
  getResetPasswordToken: () => string;
}

const User = mongoose.model<IUser>("User", userSchema);
export default User;
