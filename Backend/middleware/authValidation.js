// backend/middleware/authValidation.js
import { HttpError } from '../utils/HttpError.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,15}$/;

export function validateRegistration(req, _res, next) {
  const { name, email, password, department, phone } = req.body || {};
  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    return next(new HttpError(400, 'Name, email and password are required'));
  }
  if (name.trim().length < 2) return next(new HttpError(400, 'Name must be at least 2 characters'));
  if (!EMAIL_RE.test(email.trim())) return next(new HttpError(400, 'Enter a valid email address'));
  if (password.length < 8 || password.length > 72) {
    return next(new HttpError(400, 'Password must be between 8 and 72 characters'));
  }
  if (department !== undefined && typeof department !== 'string') {
    return next(new HttpError(400, 'Department must be text'));
  }
  if (phone && (typeof phone !== 'string' || !PHONE_RE.test(phone.trim()))) {
    return next(new HttpError(400, 'Enter a valid phone number'));
  }
  next();
}

export function validateLogin(req, _res, next) {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password || password.length > 72) {
    return next(new HttpError(400, 'A valid email and password are required'));
  }
  next();
}

export function validateStudentUpdate(req, _res, next) {
  const { name, email, password, phone } = req.body || {};
  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
    return next(new HttpError(400, 'Name must be at least 2 characters'));
  }
  if (email !== undefined && (typeof email !== 'string' || !EMAIL_RE.test(email.trim()))) {
    return next(new HttpError(400, 'Enter a valid email address'));
  }
  if (password !== undefined && (typeof password !== 'string' || password.length < 8 || password.length > 72)) {
    return next(new HttpError(400, 'Password must be between 8 and 72 characters'));
  }
  if (phone && (typeof phone !== 'string' || !PHONE_RE.test(phone.trim()))) {
    return next(new HttpError(400, 'Enter a valid phone number'));
  }
  next();
}

export function validateForgotPassword(req, _res, next) {
  const { email } = req.body || {};
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return next(new HttpError(400, 'Enter a valid email address'));
  }
  next();
}

export function validateResetPassword(req, _res, next) {
  const { password } = req.body || {};
  if (typeof password !== 'string' || password.length < 8 || password.length > 72) {
    return next(new HttpError(400, 'Password must be between 8 and 72 characters'));
  }
  next();
}
