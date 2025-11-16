import { Router } from 'express';
import {
  getCategoriesController,
  getCategoryByIdController,
} from '../controllers/categories.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/', ctrlWrapper(getCategoriesController));

router.get('/:categoryId', ctrlWrapper(getCategoryByIdController));

export default router;
