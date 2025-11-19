import {
  getAllUsers,
  getUserById,
  getMeUser,
  updateUserData,
  updateUserAvatar,
  requestResetToken,
  resetPasword,
} from '../services/users.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { UsersCollection } from '../database/models/user.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getUsersController = async (req, res) => {
  const { page, perPage = 12 } = parsePaginationParams(req.query);
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

  const updateData = {};

  if (req.file) {
    const newAvatarUrl = await saveFileToCloudinary(req.file);
    updateData.avatarUrl = newAvatarUrl;
  }

  if (req.body.description) {
    updateData.description = req.body.description;
  }

  if (Object.keys(updateData).length === 0) {
    throw createHttpError(400, 'No data provided for update');
  }

  const updatedUser = await updateUserAvatar(userId, updateData);

  if (!updatedUser) {
    throw createHttpError(404, 'User not found.');
  }

  res.status(200).json({
    message: 'Profile successfully updated!',
    data: {
      id: updatedUser._id,
      avatarUrl: updatedUser.avatarUrl,
      description: updatedUser.description,
    },
  });
};

export const getTravellersController = async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    if (
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      isNaN(limitNumber) ||
      limitNumber < 1
    ) {
      return next(createHttpError(400, 'Invalid pagination parameters'));
    }

    const skip = (pageNumber - 1) * limitNumber;

    const travellers = await UsersCollection.find()
      .skip(skip)
      .limit(limitNumber);

    const totalItems = await UsersCollection.countDocuments();

    const paginationData = calculatePaginationData(
      totalItems,
      limitNumber,
      pageNumber,
    );
    res.status(200).json({
      status: 200,
      message: 'Successfully get travellers!',
      data: {
        travellers,
        ...paginationData,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const requestResetTokenController = async (req, res) => {
  await requestResetToken(req.body.email);

  res.json({
    status: 200,
    message: 'Successfully send request to reset password!',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPasword(req.body);

  res.json({
    status: 200,
    message: 'Successfully resset password!',
    data: {},
  });
};
