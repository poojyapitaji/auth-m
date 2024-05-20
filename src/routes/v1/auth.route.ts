import { Router } from 'express';
import config from 'config';

import { auth } from '../../controllers';
import { auth as authMiddleware } from '../../middlewares';
import {
  registerValidator,
  loginValidator,
  verifyEmailValidator
} from '../../middlewares/validators';

const router = Router();

const environment = config.get<string>('environment');
const isProduction = environment === 'production';

if (isProduction) {
  router.use(authMiddleware.authRateLimiter);
}

router.post('/register', registerValidator, auth.register);
router.post('/login', loginValidator, auth.login);
router.post('/logout', auth.logout);
router.post('/refresh-token', auth.refreshToken);
router.post(
  '/email-verification',
  verifyEmailValidator,
  auth.sendEmailVerificationToken
);

export default router;
