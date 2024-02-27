import { cascadeOnDeleteUser } from '@/lib/db-actions';
import { NotFoundException } from '@/lib/exceptions';
import { handleAsync } from '@/middlewares/handle-async';
import { User } from '@/models/user.model';

export const getAllUsers = handleAsync(async (req, res) => {
  const users = await User.find();
  return res.json({ total: users.length, users });
});

export const getSingleUser = handleAsync<{ id: string }>(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new NotFoundException("User with this id doesn't exist");

  return res.json({ user });
});

export const updateUserRole = handleAsync<{ id: string }>(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new NotFoundException("User with this id doesn't exist");

  user.role = user.role === 'admin' ? 'user' : 'admin';
  await user.save({ validateBeforeSave: true });

  return res.json({ message: 'User role updated successfully' });
});

export const deleteUser = handleAsync<{ id: string }>(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new NotFoundException(`User doesn't exist or already deleted!`);
  }

  await Promise.all([
    user.deleteOne(),
    cascadeOnDeleteUser(user._id.toString())
  ]);
  return res.json({ message: 'User deleted successfully' });
});
