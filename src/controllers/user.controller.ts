import { BadRequestException, ForbiddenException, UnauthorizedException } from '@/lib/exceptions';
import sendMail from '@/lib/send-mail';
import { generateResetPasswordToken, hashPassword, verifyPassword } from '@/lib/utils';
import { handleAsync } from '@/middlewares/handle-async';
import { Notification } from '@/models/notification.model';
import { User } from '@/models/user.model';
import { cascadeOnDeleteUser } from '@/services/common.service';
import crypto from 'crypto';

export type RegisterUserBody = Partial<{
  name: string;
  email: string;
  password: string;
  image: string;
}>;
export const registerUser = handleAsync<unknown, unknown, RegisterUserBody>(async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password)
    throw new BadRequestException('Please Enter the required fields');

  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) throw new BadRequestException('User with same email already exists');

  const { name, email, password, image } = req.body;
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    image,
    isGoogleUser: false
  });
  Notification.create({
    title: `Welcome to Superdeals ${user.name}`,
    description: 'You are now eligible to add/manage products and orders on Superdeals',
    user: user.id
  });

  req.login(user, () => {
    user.password = undefined;
    return res.json({ user });
  });
});

export const getProfile = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  return res.json({ user: req.user });
});

type UpdateProfileBody = Partial<{
  name: string;
  image: string;
}>;
export const updateProfile = handleAsync<unknown, unknown, UpdateProfileBody>(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  const { name, image } = req.body;
  if (!name && !image) return res.json({ message: 'Profile updated successfully', user: req.user });

  if (name) req.user.name = name;
  if (image) req.user.image = image;
  await req.user.save({ validateBeforeSave: true });

  return res.json({
    message: 'Profile updated successfully',
    user: req.user
  });
});

export const logout = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  req.session.destroy(() => {});
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

export const forgotPassword = handleAsync<unknown, unknown, { email: string }>(async (req, res) => {
  const { email } = req.body;
  if (typeof email !== 'string') throw new BadRequestException('Please provide your email');
  const user = await User.findOne({ email });
  if (!user) throw new BadRequestException("User with this email doesn't exist");
  if (user.isGoogleUser) throw new ForbiddenException('User is previously signed in with Google');

  const { token, hashedToken } = generateResetPasswordToken();
  user.resetPasswordExpire = new Date(Date.now() + 5 * 60 * 1000).getTime();
  user.resetPasswordToken = hashedToken;
  await user.save({ validateBeforeSave: true });
  const subject = 'Account password reset - Superdeals';
  const link = `${req.get('origin')}/password/reset/${token}`;
  const message = `Click on this link to reset password. <br>
  <a href=${link}>${link}</a>
  `;

  res.json({ message: 'Password Recovery sent to mail', token });
  await sendMail({ mail: email, text: message, subject });
});

export const resetPassword = handleAsync<{ token: string }, unknown, { password?: string }>(
  async (req, res) => {
    const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) throw new BadRequestException('Token is invalid or expired');
    if (user.isGoogleUser) throw new ForbiddenException('You are previously signed in with google');

    const { password } = req.body;
    if (typeof password !== 'string') throw new BadRequestException('Please provide password');
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save({ validateBeforeSave: true });
    user.password = undefined;
    Notification.create({
      user: user._id.toString(),
      title: 'Password reset successful',
      description:
        'Your password has been recently changed. Make sure only you are accessing your account.'
    });

    req.login(user, () => {
      res.json({ user, message: 'Password reset successfully' });
    });
  }
);

type UpdatePasswordBody = { oldPassword: string; newPassword: string };
export const updatePassword = handleAsync<unknown, unknown, UpdatePasswordBody>(
  async (req, res) => {
    if (!req.user) throw new UnauthorizedException();
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) throw new BadRequestException('Please enter required fields');

    const user = await User.findById(req.user._id.toString()).select('+password').lean();

    if (!user) throw new UnauthorizedException();
    if (user.isGoogleUser) throw new BadRequestException('You are signed in with google');

    const isMatch = await verifyPassword(oldPassword, user.password!);
    if (!isMatch) throw new BadRequestException('Incorrect old password');

    const hashedPassword = await hashPassword(newPassword);
    req.user.password = hashedPassword;
    await req.user.save({ validateBeforeSave: true });

    return res.json({ message: 'Password updated successfully' });
  }
);

export const deleteProfile = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  await Promise.all([req.user.deleteOne(), cascadeOnDeleteUser(req.user._id.toString())]);
  if (!req.user) throw new UnauthorizedException();
  await req.user?.deleteOne();
  return res.json({ message: 'Your profile is deleted successfully' });
});
