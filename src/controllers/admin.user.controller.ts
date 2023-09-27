import { catchAsyncError } from "../middlewares/catchAsyncError";
import User from "../models/user.model";
import { ErrorHandler } from "../lib/errorHandler";
import cloudinary from "cloudinary";

export const getAllUsers = catchAsyncError(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ total: users.length, users });
});

export const getSingleUser = catchAsyncError<{ id: string }>(
  async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user)
      return next(new ErrorHandler("User with this id doesn't exist", 400));

    return res.status(200).json({ user });
  }
);

export const updateUserRole = catchAsyncError<{ id: string }>(
  async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user)
      return next(new ErrorHandler("User with this id doesn't exist", 400));

    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    res.status(200).json({ message: "User role updated successfully" });
  }
);

export const deleteUser = catchAsyncError<{ id: string }>(
  async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler("User deleted successfully", 200));

    const { avatar } = user;
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });

    try {
      if (avatar?.url?.includes("res.cloudinary"))
        await cloudinary.v2.uploader.destroy(avatar?.public_id || "");
    } catch (error) {
      //
    }
  }
);
