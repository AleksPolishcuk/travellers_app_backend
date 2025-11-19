import authRouter from './auth.js';
import usersRouter from './user.js';

import storiesRouter from './stories.js';
import categoriesRouter from './categories.js';
import { Router } from 'express';

const router = Router();

router.use('/api/users', usersRouter);
router.use('/api/auth', authRouter);
router.use('/api/stories', storiesRouter);
router.use('/api/categories', categoriesRouter);

router.use('/api/travellers', storiesRouter);
export default router;
