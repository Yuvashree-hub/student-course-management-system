// backend/routes/authRoutes.js
import express from 'express';
import { register, login, me, forgotPassword, resetPassword } from '../controllers/authController.js';
import { validateRegistration, validateLogin, validateForgotPassword, validateResetPassword } from '../middleware/authValidation.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/me', authMiddleware, me);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password/:token', validateResetPassword, resetPassword);

export default router;
