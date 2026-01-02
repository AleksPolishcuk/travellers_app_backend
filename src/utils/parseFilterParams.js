import { isValidObjectId } from 'mongoose';

const parseCategoryId = (value) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (!isValidObjectId(trimmed)) return undefined;
  return trimmed;
};

const parseCategoryIds = (value) => {
  if (typeof value !== 'string') return undefined;

  const ids = value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  if (ids.length === 0) return undefined;

  const validIds = ids.filter((id) => isValidObjectId(id));

  if (validIds.length === 0) return undefined;

  return validIds;
};

const parseOwnerId = (value) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (!isValidObjectId(trimmed)) return undefined;
  return trimmed;
};

export const parseFilterParams = async (query) => {
  const filter = {};

  // ---------- CATEGORY ----------
  const oneCategory = parseCategoryId(query.categoryId);
  const manyCategories = parseCategoryIds(query.categoryIds);

  if (manyCategories) {
    filter.category = { $in: manyCategories };
  } else if (oneCategory) {
    filter.category = oneCategory;
  }

  // ---------- OWNER ----------
  const ownerId = parseOwnerId(query.ownerId);
  if (ownerId) {
    filter.ownerId = ownerId;
  }

  return filter;
};
