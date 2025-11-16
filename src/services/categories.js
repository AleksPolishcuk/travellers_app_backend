import { CategoryCollection } from '../database/models/category.js';
import { SORT_ORDER } from '../constants/index.js';
export const getAllCategories = async ({
  page = 1,
  perPage = 50,
  sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
  filter = {},
}) => {
  const skip = (page - 1) * perPage;
  const categories = await CategoryCollection.find(filter)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(perPage)
    .select('_id name');

  const total = await CategoryCollection.countDocuments(filter);
  return {
    total,
    page,
    perPage,
    data: categories,
  };
};

export const getCategoryById = async (categoryId) => {
  const category = await CategoryCollection.findById(categoryId);
  return category;
};
