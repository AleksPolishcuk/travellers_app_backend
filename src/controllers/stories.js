import createHttpError from 'http-errors';
import {
  getAllStories,
  getStoryById,
  createStory,
  updateStoryById,
  deleteStoryById,
  getCategories,
} from '../services/stories.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

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

export const getStoryByIdController = async (req, res) => {
  const { storyId } = req.params;
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
  if (!req.file) {
    throw createHttpError(400, 'storyImage is required');
  }

  const imgUrl = await saveFileToCloudinary(req.file);

  const storyData = {
    img: imgUrl,
    title: req.body.title,
    article: req.body.description,
    category: req.body.category,
    fullText: req.body.description,
  };

  const story = await createStory(storyData, req.user._id);

  res.status(201).json({
    status: 201,
    message: 'Story successfully created',
    data: story,
  });
};

export const updateStoryController = async (req, res) => {
  const { storyId } = req.params;

  const updateData = {};

  if (req.body.title) updateData.title = req.body.title;
  if (req.body.category) updateData.category = req.body.category;

  if (req.body.description) {
    updateData.article = req.body.description;
    updateData.fullText = req.body.description;
  }

  const updatedStory = await updateStoryById(storyId, req.user._id, updateData);

  if (!updatedStory) {
    throw createHttpError(404, 'Story not found or you are not the owner');
  }

  res.status(200).json({
    status: 200,
    message: 'Story successfully updated',
    data: updatedStory,
  });
};

export const deleteStoryByIdController = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const userId = req.user._id;

    const { message } = await deleteStoryById(storyId, userId);

    return res.status(200).json({
      status: 200,
      message,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoriesController = async (req, res) => {
  const categories = await getCategories();
  res.status(200).json({
    status: 200,
    message: 'Successfully found categories!',
    data: categories,
  });
};
