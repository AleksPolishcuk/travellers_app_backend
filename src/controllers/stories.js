import createHttpError from 'http-errors';

import { createStory, getAllStories, getStoryById, updateStoryById, getCategories } from '../services/stories.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getStoriesController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
const filter = await parseFilterParams(req.query);

  const stories = await getAllStories({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found stories!',
    data: stories,
  });
};
export const getStoryByIdController = async (req, res, next) => {
  const { storyId } = req.params;
  // const userId = req.user._id;
  const story = await getStoryById(storyId);

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found story with id ${storyId}!`,
    data: story,
  });
};

export const createStoryController = async (req, res) => {
    const userId = req.user._id;
    const storyData = req.body;
    const newStory = await createStory(storyData, userId);

res.status(201).json({
    status: 201,
    message: 'Story successfully created!',
    data: newStory,
});
};

export const updateStoryController = async (req, res, next) => {
  const { storyId } = req.params;
  const userId = req.user._id;
  const updateData = req.body;

  if(Object.keys(updateData).length === 0){
    throw createHttpError(400, 'Missing fields to update');
  }
  const updatedStory = await updateStoryById(storyId, userId, updateData);
  if(!updatedStory){
    throw createHttpError(404, 'Story not found or you are not the ownerId');
  }
res.status(200).json({
  status: 200,
  message: `Story with id ${storyId} successfully updated!`,
});
};

export const getCategoriesController = async (req, res) => {
  const response = await getCategories();
  res.json({ status: 200, data: response });
};