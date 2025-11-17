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

// 
import Joi from 'joi';

export const createStorySchema = Joi.object({
  img: Joi.string().uri().required(), // якщо це URL картинки
  title: Joi.string().min(3).max(128).required(),
  article: Joi.string().required(),
  category: Joi.string()
    .hex()
    .length(24)
    .required(), // ObjectId
  ownerId: Joi.string()
    .hex()
    .length(24)
    .required(), // ObjectId користувача
  date: Joi.string().isoDate().required(),
  favoriteCount: Joi.number().integer().min(0).default(0),
});

export const updateStoriesSchema = Joi.object({
  img: Joi.string().uri(),
  title: Joi.string().min(3).max(128),
  article: Joi.string(),
  category: Joi.string().hex().length(24), // ObjectId
  favoriteCount: Joi.number().integer().min(0),
});