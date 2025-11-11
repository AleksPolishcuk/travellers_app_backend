import authRouter from './auth.js';
import userRouter from './user.js';

import storiesRouter from './stories.js';
import { Router } from 'express';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);

router.use('/travellers', storiesRouter);
export default router;
