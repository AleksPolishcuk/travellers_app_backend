import { Router } from 'express';
import { getTravellersController } from '../controllers/users.js';

const router = Router();

router.get('/travellers', getTravellersController);

export default router;
