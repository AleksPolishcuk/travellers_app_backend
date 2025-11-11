import authRouter from './auth.js';
import usersRouter from './user.js';

import { Router } from 'express';

const router = Router();

router.use('/users', usersRouter);
router.use('/auth', authRouter);

export default router;
