import authRouter from './auth.js';

import { Router } from 'express';

const router = Router();

router.use('/auth', authRouter);

export default router;
