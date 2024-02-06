import { cascadeOnDeleteUser } from '@/lib/db-actions';
import { BadRequestException, NotFoundException } from '@/lib/exceptions';
import { catchAsyncError } from '@/middlewares/catch-async-error';
import User from '@/models/user.model';

export const getAllUsers = catchAsyncError(async (req, res) => {
  const users = await User.find();
  return res.json({ total: users.length, users });
});

export const getSingleUser = catchAsyncError<{ id: string }>(
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new BadRequestException("User with this id doesn't exist");

    return res.json({ user });
  }
);

export const updateUserRole = catchAsyncError<{ id: string }>(
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundException("User with this id doesn't exist");

    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save({ validateBeforeSave: true });

    return res.json({ message: 'User role updated successfully' });
  }
);

export const deleteUser = catchAsyncError<{ id: string }>(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    throw new BadRequestException(`User doesn't exist or already deleted!`);

  await cascadeOnDeleteUser(user._id.toString(), user.image_public_id);
  return res.json({ message: 'User deleted successfully' });
});
