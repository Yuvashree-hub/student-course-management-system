// backend/services/authService.js
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import { HttpError } from '../utils/HttpError.js';
import { sendEmail } from '../utils/sendEmail.js';

export async function registerStudent({ name, email, password, department, phone, studentId }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new HttpError(409, 'Email is already registered');

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    department: department?.trim() || '',
    phone: phone?.trim() || '',
    studentId: studentId?.trim() || '',
    role: 'student', // public registration can never create an admin
  });
  return user.toJSON();
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
  // same message for unknown email / wrong password (no user enumeration)
  const invalid = new HttpError(401, 'Invalid email or password');
  if (!user) throw invalid;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw invalid;
  return user.toJSON();
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

// ---------------- forgot / reset password ----------------
const RESET_MINUTES = 15;
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export async function requestPasswordReset(email) {
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) return { sent: false }; // caller answers identically (no account enumeration)

  const token = crypto.randomBytes(32).toString('hex');
  user.resetTokenHash = hashToken(token); // only the hash is stored
  user.resetTokenExpires = new Date(Date.now() + RESET_MINUTES * 60 * 1000);
  await user.save();

  const base = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim().replace(/\/$/, '');
  const link = `${base}/reset-password/${token}`;

  const { delivered } = await sendEmail({
    to: user.email,
    toName: user.name,
    subject: 'Reset your ACADEXA password',
    text: `Hi ${user.name},\n\nUse this link to reset your password (valid for ${RESET_MINUTES} minutes):\n${link}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>Hi ${user.name},</p>
<p>Click the button below to reset your ACADEXA password. The link is valid for <strong>${RESET_MINUTES} minutes</strong>.</p>
<p><a href="${link}" style="background:#3D2314;color:#F4EAD2;padding:10px 18px;border-radius:6px;text-decoration:none;display:inline-block">Reset Password</a></p>
<p>Or copy this link into your browser:<br>${link}</p>
<p>If you did not request this, you can safely ignore this email.</p>`,
  });
  return { sent: true, delivered, link };
}

export async function resetPassword(token, password) {
  const user = await User.findOne({
    resetTokenHash: hashToken(token),
    resetTokenExpires: { $gt: new Date() },
  });
  if (!user) throw new HttpError(400, 'This reset link is invalid or has expired. Please request a new one.');

  user.passwordHash = await bcrypt.hash(password, 12);
  user.resetTokenHash = undefined; // one-time use
  user.resetTokenExpires = undefined;
  await user.save();
}
