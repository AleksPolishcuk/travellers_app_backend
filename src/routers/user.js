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
import {
  addSavedStoryController,
  removeSavedStoryController
} from '../controllers/savedStories.js';

import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/multer.js';
import { requestResetTokenSchema, resetPaswordSchema } from '../validation/users.js';
const router = Router();


router.get('/', getUsersController);

router.get('/travellers', getTravellersController);
router.get('/me', authenticate, getMeUserController);

router.post('/saved/:storyId', authenticate, isValidId, addSavedStoryController);
router.delete('/saved/:storyId', authenticate, isValidId, removeSavedStoryController);


router.patch('/:userId', isValidId, authenticate, patchUserController);
router.get('/:userId', isValidId, getUserByIdController);
router.patch(
  '/:userId/avatar',
  isValidId,
  authenticate,
  upload.single('avatar'),
  updateUserAvatarController,
);

router.post('/user/send-request-reset-password',validateBody(requestResetTokenSchema), requestResetTokenController);
router.post('/user/reset-password', validateBody(resetPaswordSchema), resetPasswordController);
export default router;
