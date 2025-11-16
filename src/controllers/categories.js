import createHttpError from 'http-errors';

import { getAllCategories, getCategoryById } from '../services/categories.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getCategoriesController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = await parseFilterParams(req.query);

  const categories = await getAllCategories({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found stories!',
    data: categories,
  });
};
export const getCategoryByIdController = async (req, res, next) => {
  const { categoryId } = req.params;
  const category = await getCategoryById(categoryId);

  if (!category) {
    throw createHttpError(404, 'Story not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found story with id ${categoryId}!`,
    data: category,
  });
};
