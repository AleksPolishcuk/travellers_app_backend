import { UsersCollection } from '../database/models/user.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { StoriesCollection } from '../database/models/story.js';

export const getAllUsers = async ({ page, perPage }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const usersQuery = UsersCollection.find();
  const usersCount = await UsersCollection.find()
    .merge(usersQuery)
    .countDocuments();
  const users = await usersQuery.skip(skip).limit(limit).exec();

  const paginationData = calculatePaginationData(usersCount, perPage, page);
  return {
    data: users,
    ...paginationData,
  };
};

export const getUserById = async (userId) => {
  const user = await UsersCollection.findById(userId);
  const userStories = await StoriesCollection.find({ ownerId: userId });
  return {
    user,
    stories: userStories,
  };
};

export const getMeUser = async (userId) => {
  const user = await UsersCollection.findById(userId).select('-password');
  return user;
};

export const updateUserData = async (userId, payload) => {
  const updatedUser = await UsersCollection.findByIdAndUpdate(userId, payload, {
    new: true,
  });

  if (!updatedUser) {
    return null;
  }

  return {
    user: updatedUser,
  };
};

export const updateUserAvatar = async (userId, avatarURL) => {
  const updatedUser = await UsersCollection.findByIdAndUpdate(
    userId,
    { avatarURL: avatarURL },
    { new: true },
  );

  return updatedUser;
};
