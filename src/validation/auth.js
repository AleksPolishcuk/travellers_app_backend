import Joi from 'joi';
import { EMAIL_VALID } from '../constants/index.js';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(2).max(32).required(),
  email: Joi.string().pattern(EMAIL_VALID).max(64).required(),
  password: Joi.string().min(8).max(128).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().pattern(EMAIL_VALID).max(64).required(),
  password: Joi.string().min(8).max(128).required(),
});
