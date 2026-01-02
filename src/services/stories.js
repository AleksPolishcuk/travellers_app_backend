import { SORT_ORDER } from '../constants/index.js';
import { Category } from '../database/models/category.js';
import { StoriesCollection } from '../database/models/story.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import createHttpError from 'http-errors';

export const getAllStories = async ({
  page = 1,
  perPage = 9,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const storiesQuery = StoriesCollection.find(filter)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .populate('category', 'name')
    .populate('ownerId', 'name avatarUrl articlesAmount');

  const stories = await storiesQuery.exec();

  const storiesCount = await StoriesCollection.countDocuments(filter);

  const paginationData = calculatePaginationData(storiesCount, perPage, page);

  return {
    data: stories,
    ...paginationData,
  };
};

export const getStoryById = async (storyId) => {
  const story = await StoriesCollection.findById(storyId)
    .populate('ownerId', 'name avatarUrl description ')
    .populate('category', 'name');
  return story;
};

export const createStory = async (storyData, userId) => {
  const newStory = await StoriesCollection.create({
    ...storyData,
    ownerId: userId,
  });
  return newStory;
};

export const updateStoryById = async (storyId, userId, updateData) => {
  const updatedStory = await StoriesCollection.findOneAndUpdate(
    { _id: storyId, ownerId: userId },
    updateData,
    { new: true },
  );
  return updatedStory;
};
export const deleteStoryById = async (storyId, userId) => {
  const story = await StoriesCollection.findById(storyId);

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  if (story.ownerId.toString() !== userId.toString()) {
    throw createHttpError(403, 'You are not allowed to delete this story');
  }

  await StoriesCollection.findByIdAndDelete(storyId);

  return {
    message: 'Story deleted successfully',
    story,
  };
};

export const getCategories = async () => {
  const response = Category.find();
  return response;
};
