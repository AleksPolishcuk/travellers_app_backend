import { Router } from 'express';

import {
  getUsersController,
  getUserByIdController,
  getMeUserController,
  patchUserController,
  updateUserAvatarController,
  getTravellersController,
  requestResetTokenController,
  resetPasswordController,
} from '../controllers/users.js';

import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import { uploadAvatar } from '../middlewares/multer.js';

import {
  requestResetTokenSchema,
  resetPaswordSchema,
  updateTravelerSchema,
} from '../validation/users.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

/**
 * PRIVATE
 */
router.get('/me', authenticate, ctrlWrapper(getMeUserController));

/**
 * PUBLIC
 */
router.get('/', ctrlWrapper(getUsersController));
router.get('/travellers', ctrlWrapper(getTravellersController));
router.get('/:userId', isValidId, ctrlWrapper(getUserByIdController));

/**
 * PRIVATE — update profile (traveler form)
 */
router.patch(
  '/:userId',
  isValidId,
  authenticate,
  validateBody(updateTravelerSchema),
  ctrlWrapper(patchUserController),
);

/**
 * PRIVATE — update avatar
 */
router.patch(
  '/:userId/avatar',
  isValidId,
  authenticate,
  uploadAvatar.single('avatar'),
  ctrlWrapper(updateUserAvatarController),
);

/**
 * PASSWORD RESET
 */
router.post(
  '/user/send-request-reset-password',
  validateBody(requestResetTokenSchema),
  ctrlWrapper(requestResetTokenController),
);

router.post(
  '/user/reset-password',
  validateBody(resetPaswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
