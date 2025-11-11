import {
  getAllUsers,
  getUserById,
  getMeUser,
  updateUserData,
  updateUserAvatar,
} from '../services/users.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getUsersController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const users = await getAllUsers({
    page,
    perPage,
  });
  res.status(200).json({
    message: 'Successfully found users!',
    data: users,
  });
};

export const getUserByIdController = async (req, res, next) => {
  const { userId } = req.params;
  const result = await getUserById(userId);
  if (!result) {
    throw createHttpError(404, 'User not found');
  }
  res.status(200).json({
    message: `Successfully found user with id ${userId}!`,
    data: result,
  });
};

export const getMeUserController = async (req, res) => {
  const { _id } = req.user;

  const user = await getMeUser(_id);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.status(200).json({
    message: 'Successfully found current user',
    data: user,
  });
};

export const patchUserController = async (req, res, next) => {
  const { userId } = req.params;
  const result = await updateUserData(userId, req.body);

  if (!result) {
    next(createHttpError(404, 'User not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched an user!`,
    data: result.user,
  });
};

export const updateUserAvatarController = async (req, res, next) => {
  const { userId } = req.params;

  if (req.user._id.toString() !== userId) {
    throw createHttpError(403, 'You can only update your own avatar');
  }

  if (!req.file) {
    throw createHttpError(400, 'No file uploaded for avatar update.');
  }

  const newAvatarUrl = await saveFileToCloudinary(req.file);

  const updatedUser = await updateUserAvatar(userId, newAvatarUrl);

  if (!updatedUser) {
    throw createHttpError(404, 'User not found.');
  }

  res.status(200).json({
    message: 'Avatar successfully updated!',
    data: {
      avatarUrl: updatedUser.avatarUrl,
      id: updatedUser._id,
    },
  });
};
