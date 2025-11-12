import authRouter from './auth.js';
import usersRouter from './user.js';

import storiesRouter from './stories.js';
import { Router } from 'express';

const router = Router();

router.use('/users', usersRouter);
router.use('/auth', authRouter);

router.use('/travellers', storiesRouter);
export default router;
