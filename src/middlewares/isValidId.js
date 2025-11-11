import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const id = req.params.userId || req.params.storyId || req.params.id;

  if (!id) {
    throw createHttpError(400, 'ID parameter is missing');
  }

  if (!isValidObjectId(id)) {
    throw createHttpError(404, `${id} is not a valid id`);
  }
  next();
};
