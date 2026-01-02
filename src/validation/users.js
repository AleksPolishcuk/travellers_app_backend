import Joi from 'joi';
import { EMAIL_VALID } from '../constants/index.js';

export const updateTravelerSchema = Joi.object({
  name: Joi.string().max(32).required(),
  email: Joi.string().pattern(EMAIL_VALID).max(64).required(),
  description: Joi.string().max(150).required(),
});

export const requestResetTokenSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPaswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
