import { catchAsyncError } from "../middlewares/catchAsyncError";
import User from "../models/user.model";
import { CustomError } from "../lib/customError";
import cloudinary from "cloudinary";

export const getAllUsers = catchAsyncError(async (req, res) => {
  const users = await User.find();
  return res.json({ total: users.length, users });
});

export const getSingleUser = catchAsyncError<{ id: string }>(
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new CustomError("User with this id doesn't exist", 400);

    return res.json({ user });
  }
);

export const updateUserRole = catchAsyncError<{ id: string }>(
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new CustomError("User with this id doesn't exist", 400);

    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    return res.json({ message: "User role updated successfully" });
  }
);

export const deleteUser = catchAsyncError<{ id: string }>(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new CustomError("User deleted successfully", 200);

  const { avatar } = user;
  await user.deleteOne();
  res.json({ message: "User deleted successfully" });

  try {
    if (avatar?.url?.includes("res.cloudinary"))
      await cloudinary.v2.uploader.destroy(avatar?.public_id || "");
  } catch (error) {
    //
  }
});
