import { Category } from "../database/models/category.js";


export const getCategories = async () => {
  const categories = await Category.find({}, 'name');
  return categories.map((cat) => cat.name);
};
