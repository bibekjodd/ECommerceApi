import { cascadeOnDeleteUser } from '@/lib/db-actions';
import { BadRequestException } from '@/lib/exceptions';
import { uploadProductImage } from '@/lib/image-services';
import sendMail from '@/lib/send-mail';
import { cookieOptions, filterUser } from '@/lib/utils';
import { catchAsyncError } from '@/middlewares/catch-async-error';
import User from '@/models/user.model';
import crypto from 'crypto';

export type RegisterUserBody = Partial<{
  name: string;
  email: string;
  password: string;
  imageDataUri: string;
}>;
export const registerUser = catchAsyncError<unknown, unknown, RegisterUserBody>(
  async (req, res) => {
    const { name, email, password, imageDataUri } = req.body;
    if (!name || !email || !password)
      throw new BadRequestException('Please Enter the required fields');

    const userExists = await User.findOne({ email });
    if (userExists)
      throw new BadRequestException('User with same email already exists');

    const user = await User.create({ name, email, password });
    if (imageDataUri) {
      const res = await uploadProductImage(imageDataUri);
      if (res) {
        user.image = res.url;
        user.image_public_id = res.public_id;
      }
      await user.save({ validateBeforeSave: true });
    }

    const token = user.generateToken();
    return res
      .cookie('token', token, cookieOptions)
      .status(201)
      .json({ user: filterUser(user) });
  }
);

type LoginUserBody = Partial<{
  email: string;
  password: string;
}>;
export const loginUser = catchAsyncError<unknown, unknown, LoginUserBody>(
  async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
      throw new BadRequestException('Please enter required credentials');

    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new BadRequestException('Invalid user credentials');

    const isMatch = await user.comparePassword(password || '');
    if (!isMatch) throw new BadRequestException('Invalid user credentials');

    const token = user.generateToken();
    return res
      .cookie('token', token, cookieOptions)
      .json({ user: filterUser(user) });
  }
);

export const getUserProfile = catchAsyncError(async (req, res) => {
  return res.json({ user: filterUser(req.user) });
});

export const logout = catchAsyncError(async (req, res) => {
  return res
    .status(200)
    .cookie('token', 'token', cookieOptions)
    .json({ message: 'Logged out successfully' });
});

export const deleteProfile = catchAsyncError(async (req, res) => {
  res.json({ message: 'Your profile is deleted successfully' });
  await cascadeOnDeleteUser(req.user._id.toString(), req.user.image_public_id);
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
  if (!email) throw new BadRequestException('Please provide your email');
  const user = await User.findOne({ email });
  if (!user)
    throw new BadRequestException("User with this email doesn't exist");

  const token = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: true });
  const subject = 'ECommerce Api Password Reset';
  const link = `${req.get('origin')}/password/reset/${token}`;
  const message = `Click on this link to reset password. <br>
  <a href=${link}>${link}</a>
  `;

  res.json({ message: 'Password Recovery sent to mail', token });
  await sendMail({ mail: email, text: message, subject });
});

export const resetPassword = catchAsyncError<
  { token: string },
  unknown,
  { password?: string }
>(async (req, res) => {
  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) throw new BadRequestException('Token is invalid or expired');

  const { password } = req.body;
  if (!password) throw new BadRequestException('Please provide password');
  user.password = password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save({ validateBeforeSave: true });

  const token = user.generateToken();
  return res
    .cookie('token', token, cookieOptions)
    .json({ user: filterUser(user) });
});

type UpdatePasswordBody = { oldPassword: string; newPassword: string };
export const updatePassword = catchAsyncError<
  unknown,
  unknown,
  UpdatePasswordBody
>(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    throw new BadRequestException('Please enter required fields');

  const isMatch = await req.user.comparePassword(oldPassword);
  if (!isMatch) throw new BadRequestException('Incorrect old password');

  req.user.password = newPassword;
  await req.user.save({ validateBeforeSave: true });

  return res.json({ message: 'Password updated successfully' });
});

type UpdateProfileBody = Partial<{
  name: string;
  email: string;
  imageDataUri: string;
}>;
export const updateProfile = catchAsyncError<
  unknown,
  unknown,
  UpdateProfileBody
>(async (req, res) => {
  const { name, email, imageDataUri } = req.body;
  if (name) req.user.name = name;
  if (email) req.user.email = email;

  let uploadFailed = false;
  if (imageDataUri) {
    try {
      const res = await uploadProductImage(imageDataUri);
      if (res) {
        req.user.image = res.url;
        req.user.image_public_id = res.public_id;
      }
    } catch (err) {
      uploadFailed = true;
    }
  }
  await req.user.save({ validateBeforeSave: true });
  return res.json({
    message: `Profile updated successfully ${
      uploadFailed ? 'but image could not be updated' : ''
    }`,
    user: filterUser(req.user)
  });
});
