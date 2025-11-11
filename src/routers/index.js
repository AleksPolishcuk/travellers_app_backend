import authRouter from './auth.js';
import storiesRouter from './stories.js';
import { Router } from 'express';

const router = Router();

router.use('/auth', authRouter);
router.use('/travellers', storiesRouter);
export default router;
