import { UsersCollection } from '../database/models/user.js';
import { StoriesCollection } from '../database/models/story.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { SMTP, TEMP_UPLOAD_DIR } from '../constants/index.js';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import { getEnvVar } from '../utils/getEnvVar.js';
import path from 'node:path';
import {sendEmail} from '../utils/sendEmail.js';
import { SessionsCollection } from '../database/models/session.js';

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

  if (!updatedUser) return null;

  return { user: updatedUser };
};

export const updateUserAvatar = async (userId, updateData) => {
  const updatedUser = await UsersCollection.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
    },
  );
  return updatedUser;
};

export const addFavoriteStory = async (userId, storyId) => {
  const user = await UsersCollection.findById(userId).select('savedStories');
  if (!user) throw createHttpError(404, 'User not found');

  const story = await StoriesCollection.findById(storyId);
  if (!story) throw createHttpError(404, 'Story not found');

  const alreadySaved = user.savedStories?.some(
    (id) => id.toString() === storyId,
  );
  if (alreadySaved) throw createHttpError(400, 'Story already saved');

  user.savedStories.push(storyId);
  await user.save();

  await StoriesCollection.findByIdAndUpdate(storyId, {
    $inc: { favoriteCount: 1 },
  });

  return user.savedStories;
};

export const removeFavoriteStory = async (userId, storyId) => {
  const user = await UsersCollection.findById(userId).select('savedStories');
  if (!user) throw createHttpError(404, 'User not found');

  const before = user.savedStories.length;
  user.savedStories = user.savedStories.filter(
    (id) => id.toString() !== storyId,
  );

  if (before === user.savedStories.length) {
    throw createHttpError(404, 'Story not found in saved');
  }

  await user.save();

  const story = await StoriesCollection.findById(storyId).select(
    'favoriteCount',
  );
  if (story) {
    const dec = story.favoriteCount > 0 ? -1 : 0;
    if (dec !== 0) {
      await StoriesCollection.findByIdAndUpdate(storyId, {
        $inc: { favoriteCount: dec },
      });
    }
  }

  return user.savedStories;
};

export const getFavoriteStories = async (userId, { page, perPage }) => {
  const user = await UsersCollection.findById(userId).select('savedStories');
  if (!user) throw createHttpError(404, 'User not found');

  const savedIds = (user.savedStories || []).map((id) => id.toString());

  const limit = perPage;
  const skip = (page - 1) * perPage;

  if (savedIds.length === 0) {
    return {
      data: [],
      ...calculatePaginationData(0, perPage, page),
    };
  }

  const totalItems = await StoriesCollection.countDocuments({
    _id: { $in: savedIds },
  });
  const paginationData = calculatePaginationData(totalItems, perPage, page);

  const stories = await StoriesCollection.find({ _id: { $in: savedIds } })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate('category', 'name')
    .populate('ownerId', 'name avatarUrl description');

  return {
    data: stories,
    ...paginationData,
  };
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found');

  const resetToken = jwt.verify(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    { expiresIn: '5m' },
  );

  const templatePath = path.join(
    TEMP_UPLOAD_DIR,
    'template-request-email-token.html'
  );
  const templateSource = (await fs.readFile(templatePath)).toString();
  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-email?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject:  'Reset your email',
      html
    });
  } catch (error) {
    if (error.status === 500) {
      throw createHttpError(
        500,
        'Failed to send the email, please try again later.',
      );
    }
  }
};



export const resetEmail = async (payload) =>{
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (error) {
    createHttpError(401, error.message);
    throw error;
  }

  const user = await UsersCollection.findOne(
    {_id: entries.sub},
  );

  if (!user) throw createHttpError(404, 'User not found');

  const isExpired = new Date() > payload.token;
  if (isExpired) throw createHttpError(401, 'Token is expired or invalid');

  await UsersCollection.findOneAndUpdate(
    {_id: user._id},
    {email: payload.email} 
  );

  await SessionsCollection.deleteOne({ userId: user._id });
};
