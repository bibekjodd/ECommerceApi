import { catchAsyncError } from "../middlewares/catchAsyncError";
import User from "../models/User.Model";
import { ErrorHandler } from "../lib/errorHandler";
import sendToken, { cookieOptions } from "../lib/sendToken";
import sendEmail from "../lib/sendEmail";
import crypto from "crypto";
import { uploadImage } from "../lib/cloudinary";

interface RegisterUserBody {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
}
/**
 * register user api
 * `avatar` must be passed as datauri
 */
export const registerUser = catchAsyncError<unknown, unknown, RegisterUserBody>(
  async (req, res, next) => {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password)
      return next(new ErrorHandler("Please enter required fields", 400));

    const userExists = await User.findOne({ email });
    if (userExists)
      return next(new ErrorHandler("User with same email already exists", 400));

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

interface LoginBody {
  email?: string;
  password?: string;
}
/**
 * Login api. Sends the token to user
 */
export const loginUser = catchAsyncError<unknown, unknown, LoginBody>(
  async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new ErrorHandler("Please enter required credintials", 400));

    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new ErrorHandler("Invalid user credintials", 400));

    const isMatch = await user.comparePassword(password || "");
    if (!isMatch)
      return next(new ErrorHandler("Invalid user credintials", 400));

    sendToken(user, res, 200);
  }
);

/**
 * Get My Profile Api
 */
export const getUserDetails = catchAsyncError(async (req, res) => {
  res.status(200).json({ user: req.user });
});

/**
 * logout api
 */
export const logout = catchAsyncError(async (req, res) => {
  const { maxAge, ...logoutOptions } = cookieOptions;
  maxAge;

  return res
    .status(200)
    .clearCookie("token", logoutOptions)
    .json({ message: "Logged out successfully" });
});

export const deleteProfile = catchAsyncError(async (req, res) => {
  await req.user.deleteOne();

  return res
    .status(200)
    .json({ message: "Your profile is deleted successfully" });
});

/**
 * forgot password Api
 */
interface ForgotPasswordBody {
  email?: string;
}
export const forgotPassword = catchAsyncError<
  unknown,
  unknown,
  ForgotPasswordBody
>(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new ErrorHandler("Please provide your email", 400));
  const user = await User.findOne({ email });
  if (!user)
    return next(new ErrorHandler("User with this email doesn't exist", 400));

  const token = user.getResetPasswordToken();
  await user.save();
  const subject = "ECommerce Api Password Reset";
  const link = `${req.get('origin')}/password/reset/${token}`;
  const message = `Click on this link to reset password. <br>
  <a href=${link}>${link}</a>
  `;

  await sendEmail({ mail: email, text: message, subject });
  res.status(200).json({ message: "Password Recovery sent to mail" });
});

export const resetPassword = catchAsyncError<
  { token: string },
  unknown,
  { password?: string }
>(async (req, res, next) => {
  const token = req.params.token;
  const resetToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return next(new ErrorHandler("Token is invalid or expired", 400));

  const { password } = req.body;
  if (!password) return next(new ErrorHandler("Please provide password", 400));
  user.password = password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();

  sendToken(user, res, 200);
});

export const updatePassword = catchAsyncError<
  unknown,
  unknown,
  { oldPassword: string; newPassword: string }
>(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return next(new ErrorHandler("Please enter required fields", 400));

  const isMatch = await req.user.comparePassword(oldPassword);
  if (!isMatch) return next(new ErrorHandler("Incorrect old password", 400));

  req.user.password = newPassword;
  await req.user.save();

  res.status(200).json({ message: "Password updated successfully" });
});

export const updateProfile = catchAsyncError<
  unknown,
  unknown,
  {
    name?: string;
    email?: string;
    avatar?: string;
  }
>(async (req, res) => {
  const { name, email, avatar } = req.body;
  if (name) req.user.name = name;
  if (email) req.user.email = email;

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
  return res.status(200).json({
    message: `Profile updated successfully ${
      uploadFailed ? "but avatar could not be updated" : ""
    }`,
  });
});
