import { Router } from 'express';
import {
  createStoryController,
  getStoriesController,
  getStoryByIdController,
  updateStoryController,
  deleteStoryByIdController,
  getCategoriesController,
} from '../controllers/stories.js';

import {
  addFavoriteStoryController,
  removeFavoriteStoryController,
  getFavoriteStoriesController,
} from '../controllers/users.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { uploadStoryImage } from '../middlewares/multer.js';

import {
  createStorySchema,
  updateStoriesSchema,
} from '../validation/stories.js';

const router = Router();

/**
 * PUBLIC
 */
router.get('/', ctrlWrapper(getStoriesController));
router.get('/categories', ctrlWrapper(getCategoriesController));
router.get('/saved', authenticate, ctrlWrapper(getFavoriteStoriesController));

router.get('/:storyId', isValidId, ctrlWrapper(getStoryByIdController));

/**
 * PRIVATE — SAVED / FAVORITES (ТЗ)
 */

router.post(
  '/:storyId/saved',
  authenticate,
  isValidId,
  ctrlWrapper(addFavoriteStoryController),
);

router.delete(
  '/:storyId/saved',
  authenticate,
  isValidId,
  ctrlWrapper(removeFavoriteStoryController),
);

/**
 * PRIVATE — CREATE / UPDATE / DELETE STORY
 */
router.post(
  '/',
  uploadStoryImage.single('storyImage'),
  authenticate,
  validateBody(createStorySchema),
  ctrlWrapper(createStoryController),
);

router.patch(
  '/:storyId',
  authenticate,
  isValidId,
  validateBody(updateStoriesSchema),
  ctrlWrapper(updateStoryController),
);

router.delete(
  '/:storyId',
  authenticate,
  isValidId,
  ctrlWrapper(deleteStoryByIdController),
);

export default router;
