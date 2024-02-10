import { cascadeOnDeleteUser } from '@/lib/db-actions';
import { BadRequestException } from '@/lib/exceptions';
import sendMail from '@/lib/send-mail';
import { cookieOptions, filterUser, generateAuthToken } from '@/lib/utils';
import { handleAsync } from '@/middlewares/catch-async-error';
import { Notification } from '@/models/notification.model';
import { User } from '@/models/user.model';
import crypto from 'crypto';

export type RegisterUserBody = Partial<{
  name: string;
  email: string;
  password: string;
  image: string;
}>;
export const registerUser = handleAsync<unknown, unknown, RegisterUserBody>(
  async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password)
      throw new BadRequestException('Please Enter the required fields');

    const userExists = await User.findOne({ email: req.body.email });
    if (userExists)
      throw new BadRequestException('User with same email already exists');

    const user = await User.create({ ...req.body });
    const token = generateAuthToken(user._id.toString());
    Notification.create({
      title: `Welcome to Superdeals ${user.name}`,
      description:
        'You are now eligible to add/manage products and orders on Superdeals',
      user: user.id
    });
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
export const loginUser = handleAsync<unknown, unknown, LoginUserBody>(
  async (req, res) => {
    const { email, password } = req.body;
    const exception = new BadRequestException('Invalid user credentials');

    if (!email || !password) throw exception;
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw exception;

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw exception;

    const token = generateAuthToken(user._id.toString());
    return res
      .cookie('token', token, cookieOptions)
      .json({ user: filterUser(user) });
  }
);

export const getUserProfile = handleAsync(async (req, res) => {
  return res.json({ user: filterUser(req.user) });
});

export const logout = handleAsync(async (req, res) => {
  return res
    .status(200)
    .cookie('token', 'token', cookieOptions)
    .json({ message: 'Logged out successfully' });
});

export const deleteProfile = handleAsync(async (req, res) => {
  await Promise.all([req.user.deleteOne(), cascadeOnDeleteUser(req.userId)]);
  return res.json({ message: 'Your profile is deleted successfully' });
});

interface ForgotPasswordBody {
  email?: string;
}
export const forgotPassword = handleAsync<unknown, unknown, ForgotPasswordBody>(
  async (req, res) => {
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
  }
);

export const resetPassword = handleAsync<
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

  const token = generateAuthToken(user._id.toString());
  Notification.create({
    user: req.userId,
    title: 'Password reset successful',
    description:
      'Your password has been recently changed. Make sure only you are accessing your account.'
  });
  return res
    .cookie('token', token, cookieOptions)
    .json({ user: filterUser(user) });
});

type UpdatePasswordBody = { oldPassword: string; newPassword: string };
export const updatePassword = handleAsync<unknown, unknown, UpdatePasswordBody>(
  async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      throw new BadRequestException('Please enter required fields');

    const isMatch = await req.user.comparePassword(oldPassword);
    if (!isMatch) throw new BadRequestException('Incorrect old password');

    req.user.password = newPassword;
    await req.user.save({ validateBeforeSave: true });

    return res.json({ message: 'Password updated successfully' });
  }
);

type UpdateProfileBody = Partial<{
  name: string;
  email: string;
  image: string;
}>;
export const updateProfile = handleAsync<unknown, unknown, UpdateProfileBody>(
  async (req, res) => {
    const { name, email, image } = req.body;
    if (name) req.user.name = name;
    if (email) req.user.email = email;

    await req.user.updateOne(
      {
        name: name || undefined,
        email: email || undefined,
        image: image || undefined
      },
      { runValidators: true }
    );
    return res.json({
      message: 'Profile updated successfully',
      user: filterUser(req.user)
    });
  }
);
