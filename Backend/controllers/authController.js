// backend/controllers/authController.js
import { registerStudent, loginUser, requestPasswordReset, resetPassword as doReset } from '../services/authService.js';
import { signToken } from '../utils/token.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const student = await registerStudent(req.body);
  res.status(201).json({ message: 'Student registered successfully', student });
});

export const login = asyncHandler(async (req, res) => {
  const user = await loginUser(req.body);
  const { token, expiresIn } = signToken({ _id: user.id, email: user.email, role: user.role });
  res.status(200).json({
    message: 'Login successful',
    token,
    tokenType: 'Bearer',
    expiresIn,
    student: user, // kept as "student" for frontend compatibility; admins use it too
    user,
  });
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user.toJSON() });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await requestPasswordReset(req.body.email).catch((err) => {
    console.error('Password reset email failed:', err.message);
    return { sent: false };
  });

  // Same answer whether or not the account exists (prevents account enumeration)
  const body = { message: 'If an account exists for that email, a password reset link has been sent.' };

  if (result.sent && !result.delivered) {
    console.log(`🔗 Password reset link (email not configured): ${result.link}`);
    if (process.env.NODE_ENV !== 'production') body.devResetLink = result.link; // local testing only
  }
  res.status(200).json(body);
});

export const resetPassword = asyncHandler(async (req, res) => {
  await doReset(req.params.token, req.body.password);
  res.status(200).json({ message: 'Password reset successful. You can now log in with your new password.' });
});
