import Joi from 'joi';

export const createStorySchema = Joi.object({
  title: Joi.string().max(80).required(),
  description: Joi.string().max(2500).required(),
  category: Joi.string().hex().length(24).required(),
});

export const updateStoriesSchema = Joi.object({
  title: Joi.string().max(80),
  description: Joi.string().max(2500),
  category: Joi.string().hex().length(24),
});
