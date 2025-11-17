import authRouter from './auth.js';
import usersRouter from './user.js';

import storiesRouter from './stories.js';
import categoriesRouter from './categories.js';
import { Router } from 'express';

const router = Router();

router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/stories', storiesRouter);
router.use('/categories', categoriesRouter);

router.use('/travellers', storiesRouter);
export default router;
