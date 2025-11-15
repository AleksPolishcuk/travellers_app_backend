import { SORT_ORDER } from '../constants/index.js';
import { StoriesCollection } from '../database/models/story.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

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
  const story = await StoriesCollection.findById(storyId);
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
