import { Router } from 'express';
import {
  getUsersController,
  getUserByIdController,
  getMeUserController,
  patchUserController,
  updateUserAvatarController,
  getTravellersController,
  requestResetTokenController,
  resetEmailController,
} from '../controllers/users.js';

import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/multer.js';
import { requestResetTokenSchema, resetEmailSchema } from '../validation/users.js';
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
router.post('/user/send-request-reset-email',validateBody(requestResetTokenSchema), requestResetTokenController);
router.post('/user/reset-email', validateBody(resetEmailSchema), resetEmailController);
export default router;
