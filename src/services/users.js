import { UsersCollection } from '../database/models/user.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { StoriesCollection } from '../database/models/story.js';
import jwt from 'jsonwebtoken';
import { SMTP, TEMP_UPLOAD_DIR } from '../constants/index.js';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import createHttpError from 'http-errors';
import { getEnvVar } from '../utils/getEnvVar.js';
import path from 'node:path';
import { sendEmail } from '../utils/sendEmail.js';
import bcrypt from 'bcryptjs';
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

  if (!updatedUser) {
    return null;
  }

  return {
    user: updatedUser,
  };
};

export const updateUserAvatar = async (userId, updateData) => {
  const updatedUser = await UsersCollection.findByIdAndUpdate(
    userId,
    updateData,
    { new: true },
  );

  return updatedUser;
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.verify(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const templatePath = path.join(
    TEMP_UPLOAD_DIR,
    'template-request-reset-token.html',
  );

  const templateSource = (await fs.readFile(templatePath)).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
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

export const resetPasword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (error) {
    createHttpError(401, error.message);
    throw error;
  }

  const user = await UsersCollection.findOne({
    _id: entries.sub,
    email: entries.email,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isExpired = new Date() > payload.token;

  if (isExpired) {
    throw createHttpError(401, 'Token is expired or invalid');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.findOneAndUpdate(
    { _id: user._id },
    { password: encryptedPassword },
  );

  await SessionsCollection.deleteOne({ userId: user._id });
};
