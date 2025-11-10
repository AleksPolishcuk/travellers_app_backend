// import Joi from 'joi';
// import { CATEGORIES } from '../constants/index.js';

// export const createStorySchema = Joi.object({
//   title: Joi.string().min(3).max(128).required(),
//   article: Joi.string().allow('').required(),
//   fullText: Joi.string().allow('').required(),
//   category: Joi.string()
//     .valid(...CATEGORIES)
//     .required(),
// });

// export const updateStoriesSchema = Joi.object({
//   title: Joi.string().min(3).max(128),
//   article: Joi.string().allow(''),
//   fullText: Joi.string().allow(''),
//   category: Joi.string().valid(...CATEGORIES),
// });

//?=========================================

import Joi from 'joi';
import { Category } from '../database/models/category.js';

export const createStorySchema = Joi.object({
  title: Joi.string().min(3).max(128).required(),
  article: Joi.string().allow('').required(),
  fullText: Joi.string().allow('').required(),
  category: Joi.string()
    .valid(Category)
    .required(),
});

export const updateStoriesSchema = Joi.object({
  title: Joi.string().min(3).max(128),
  article: Joi.string().allow(''),
  fullText: Joi.string().allow(''),
  category: Joi.string().valid(Category),
});
