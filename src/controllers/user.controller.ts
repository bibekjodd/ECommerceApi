import { catchAsyncError } from "../middlewares/catchAsyncError";
import User from "../models/user.model";
import { CustomError } from "../lib/customError";
import sendToken, { cookieOptions } from "../lib/sendToken";
import sendEmail from "../lib/sendMail";
import crypto from "crypto";
import { uploadImage } from "../lib/cloudinary";
import {
  LoginUserBody,
  RegisterUserBody,
  UpdateProfileBody,
} from "../types/user";

/**
 * register user api
 *
 * `avatar` must be passed as datauri
 */
export const registerUser = catchAsyncError<unknown, unknown, RegisterUserBody>(
  async (req, res) => {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password)
      throw new CustomError("Please Enter the required fields", 400);

    const userExists = await User.findOne({ email });
    if (userExists)
      throw new CustomError("User with same email already exists", 400);

    const user = await User.create({ name, email, password });
    if (avatar) {
      const res = await uploadImage(avatar);
      if (res) {
        user.avatar = {
          public_id: res.public_id,
          url: res.url,
        };
      }
      await user.save();
    }

    sendToken(user, res, 201);
  }
);

/**
 * Login api. Sends the token to user
 */
export const loginUser = catchAsyncError<unknown, unknown, LoginUserBody>(
  async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
      throw new CustomError("Please enter required credintials", 400);

    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new CustomError("Invalid user credintials", 400);

    const isMatch = await user.comparePassword(password || "");
    if (!isMatch) throw new CustomError("Invalid user credintials", 400);

    sendToken(user, res, 200);
  }
);

/**
 * Get My Profile Api
 */
export const getUserDetails = catchAsyncError(async (req, res) => {
  return res.json({ user: req.user });
});

/**
 * logout api
 */
export const logout = catchAsyncError(async (req, res) => {
  return res
    .status(200)
    .cookie("token", "token", cookieOptions)
    .json({ message: "Logged out successfully" });
});

export const deleteProfile = catchAsyncError(async (req, res) => {
  await req.user.deleteOne();

  return res
    .status(200)
    .json({ message: "Your profile is deleted successfully" });
});

interface ForgotPasswordBody {
  email?: string;
}
export const forgotPassword = catchAsyncError<
  unknown,
  unknown,
  ForgotPasswordBody
>(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new CustomError("Please provide your email", 400);
  const user = await User.findOne({ email });
  if (!user) throw new CustomError("User with this email doesn't exist", 400);

  const token = user.getResetPasswordToken();
  await user.save();
  const subject = "ECommerce Api Password Reset";
  const link = `${req.get("origin")}/password/reset/${token}`;
  const message = `Click on this link to reset password. <br>
  <a href=${link}>${link}</a>
  `;

  await sendEmail({ mail: email, text: message, subject });
  return res.json({ message: "Password Recovery sent to mail", token });
});

export const resetPassword = catchAsyncError<
  { token: string },
  unknown,
  { password?: string }
>(async (req, res) => {
  const token = req.params.token;
  const resetToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw new CustomError("Token is invalid or expired", 400);

  const { password } = req.body;
  if (!password) throw new CustomError("Please provide password", 400);
  user.password = password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();

  sendToken(user, res, 200);
});

type UpdatePasswordBody = { oldPassword: string; newPassword: string };
export const updatePassword = catchAsyncError<
  unknown,
  unknown,
  UpdatePasswordBody
>(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    throw new CustomError("Please enter required fields", 400);

  const isMatch = await req.user.comparePassword(oldPassword);
  if (!isMatch) throw new CustomError("Incorrect old password", 400);

  req.user.password = newPassword;
  await req.user.save();

  return res.json({ message: "Password updated successfully" });
});

export const updateProfile = catchAsyncError<
  unknown,
  unknown,
  UpdateProfileBody
>(async (req, res) => {
  const { name, email, avatar, password } = req.body;
  if (name) req.user.name = name;
  if (email) req.user.email = email;
  if (password) req.user.password = password;

  let uploadFailed = false;
  if (avatar) {
    try {
      const res = await uploadImage(avatar);
      if (res) {
        req.user.avatar = {
          public_id: res.public_id,
          url: res.url,
        };
      }
    } catch (err) {
      uploadFailed = true;
    }
  }
  await req.user.save();
  return res.json({
    message: `Profile updated successfully ${
      uploadFailed ? "but avatar could not be updated" : ""
    }`,
  });
});
