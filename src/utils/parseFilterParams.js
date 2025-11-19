import { getAllCategories } from '../services/categories.js';

const parseStoryType = async (storyType) => {
  if (typeof storyType !== 'string') return undefined;

  const categories = await getAllCategories();
  const trimmed = storyType.trim();

  if (!categories.includes(trimmed)) return undefined;
  return trimmed;
};

const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return undefined;
};

export const parseFilterParams = async (query) => {
  const { storyType, isFavourite } = query;
  const parsedStoryType = await parseStoryType(storyType);
  const parsedIsFavourite = parseBoolean(isFavourite);

  return {
    ...(parsedStoryType !== undefined && { storyType: parsedStoryType }),
    ...(parsedIsFavourite !== undefined && { isFavourite: parsedIsFavourite }),
  };
};
