import mongoose, { InferSchemaType } from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

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
      validate: {
        validator: validator.isEmail,
        message: "Must provide valid email",
      },
    },

    password: {
      type: String,
      required: [true, "Password is mandatory field"],
      select: false,
      minLength: [6, "Password must be at least 6 characters"],
      maxLength: [12, "Password should not exceed 12 characters"],
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

interface IUser extends mongoose.Document, InferSchemaType<typeof userSchema> {
  comparePassword: (password: string) => Promise<boolean>;
}

const User = mongoose.model<IUser>("User", userSchema);
export default User;
