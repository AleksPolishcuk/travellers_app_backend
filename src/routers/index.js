import authRouter from './auth.js';
import userRouter from './user.js';

import { Router } from 'express';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);

export default router;
