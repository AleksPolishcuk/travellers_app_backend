import { Category } from "../database/models/category";


export const getCategories = async () => {
  const categories = await Category.find({}, 'name');
  return categories.map((cat) => cat.name);
};
