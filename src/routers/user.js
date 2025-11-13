import { Router } from 'express';
import {
  getUsersController,
  getUserByIdController,
  getMeUserController,
  patchUserController,
  updateUserAvatarController,
  getTravellersController,
  resetPaswordController,
  requestResetPasswordController,
} from '../controllers/users.js';

import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/multer.js';
const router = Router();

router.get('/me', authenticate, getMeUserController);

router.patch('/:userId', isValidId, authenticate, patchUserController);

router.patch(
  '/:userId/avatar',
  isValidId,
  authenticate,
  upload.single('avatar'),
  updateUserAvatarController,
);

router.get('/', getUsersController);

router.get('/:userId', isValidId, getUserByIdController);

router.get('/travellers', getTravellersController);
router.post('/user/send-request-reset-password', requestResetPasswordController);
router.post('/user/reset-password', resetPaswordController);
export default router;
