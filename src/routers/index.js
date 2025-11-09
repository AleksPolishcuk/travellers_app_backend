import authRouter from './auth.js';
import storiesRouter from './stories.js';
import { Router } from 'express';

const router = Router();

router.use('/auth', authRouter);
router.use("/stories", storiesRouter);
export default router;
