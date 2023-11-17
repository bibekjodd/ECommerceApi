import { CustomError } from '@/lib/custom-error';
import { cascadeOnDeleteUser } from '@/lib/db-actions';
import { catchAsyncError } from '@/middlewares/catch-async-error';
import User from '@/models/user.model';

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

    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();

    return res.json({ message: 'User role updated successfully' });
  }
);

export const deleteUser = catchAsyncError<{ id: string }>(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    throw new CustomError(`User doesn't exist or already deleted!`, 200);

  await cascadeOnDeleteUser(user._id.toString(), user.avatar?.public_id);
  return res.json({ message: 'User deleted successfully' });
});
