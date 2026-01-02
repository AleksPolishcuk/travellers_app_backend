import {
  getAllUsers,
  getUserById,
  getMeUser,
  updateUserData,
  updateUserAvatar,
  addFavoriteStory,
  removeFavoriteStory,
  getFavoriteStories,
  requestResetToken,
  resetEmail,
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

export const getUserByIdController = async (req, res) => {
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

  if (req.user._id.toString() !== userId) {
    return next(createHttpError(403, 'You can only update your own profile'));
  }

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

export const updateUserAvatarController = async (req, res) => {
  const { userId } = req.params;

  if (req.user._id.toString() !== userId) {
    throw createHttpError(403, 'You can only update your own avatar');
  }

  /**
   * ТЗ: avatar binary required, max 500kB
   * size limit забезпечує multer, тут — required
   */
  if (!req.file) {
    throw createHttpError(400, 'avatar is required');
  }

  // ТЗ: description required (max 150)
  if (!req.body.description) {
    throw createHttpError(400, 'description is required');
  }

  const newAvatarUrl = await saveFileToCloudinary(req.file);

  const updateData = {
    avatarUrl: newAvatarUrl,
    description: req.body.description,
  };

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
      Number.isNaN(pageNumber) ||
      pageNumber < 1 ||
      Number.isNaN(limitNumber) ||
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

export const addFavoriteStoryController = async (req, res) => {
  const userId = req.user._id;
  const { storyId } = req.params;

  const favorites = await addFavoriteStory(userId, storyId);

  res.status(200).json({
    status: 200,
    message: 'Story added to favorites',
    data: favorites,
  });
};

export const removeFavoriteStoryController = async (req, res) => {
  const userId = req.user._id;
  const { storyId } = req.params;

  const favorites = await removeFavoriteStory(userId, storyId);

  res.status(200).json({
    status: 200,
    message: 'Story removed from favorites',
    data: favorites,
  });
};

export const getFavoriteStoriesController = async (req, res) => {
  const userId = req.user._id;

  const { page, perPage } = parsePaginationParams(req.query);

  const result = await getFavoriteStories(userId, { page, perPage });

  res.status(200).json({
    status: 200,
    message: 'Successfully found favorite stories!',
    data: result,
  });
};

export const requestResetTokenController = async (req, res) => {
  await requestResetToken(req.body.email);

  res.json({
    status: 200,
    message: 'Successfully send request to reset password!',
    data: {},
  });
};



export const resetEmailController = async (req, res) =>{
  await resetEmail(req.body);

  res.json({
    status: 200,
    message: 'Successfully reset Email!',
    data: {},
  });
};
