import { Router } from 'express';
import {
  createStoryController,
  getStoriesController,
  getStoryByIdController,
  updateStoryController,
  getCategoriesController,
} from '../controllers/stories.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createStorySchema,
  updateStoriesSchema,
} from '../validation/stories.js';
import {upload} from "../middlewares/multer.js";
const router = Router();

router.get('/', ctrlWrapper(getStoriesController));

router.get('/categories', ctrlWrapper(getCategoriesController));

router.get('/:storyId', ctrlWrapper(getStoryByIdController));

router.post(
  '/',
  upload.single("img"),
  authenticate,
  validateBody(createStorySchema),
  ctrlWrapper(createStoryController),
);
router.patch(
  '/:storyId',
  authenticate,
  validateBody(updateStoriesSchema),
  ctrlWrapper(updateStoryController),
);
export default router;
