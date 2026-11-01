// backend/controllers/enrollmentController.js
import mongoose from 'mongoose';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import { HttpError } from '../utils/HttpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notifyUser } from '../services/notificationService.js';

export const enroll = asyncHandler(async (req, res) => {
  const { courseId } = req.body || {};
  if (!courseId || !mongoose.isValidObjectId(courseId)) throw new HttpError(400, 'A valid courseId is required');
  const course = await Course.findById(courseId);
  if (!course) throw new HttpError(404, 'Course not found');

  const exists = await Enrollment.findOne({ studentId: req.user._id, courseId });
  if (exists) throw new HttpError(409, 'You are already enrolled in this course');

  const enrollment = await Enrollment.create({ studentId: req.user._id, courseId });
  await notifyUser(req.user._id, {
    title: 'Enrollment confirmed',
    message: `You are now enrolled in "${course.title}".`,
    type: 'enrollment',
  });
  res.status(201).json({ message: 'Enrolled successfully', enrollment: await enrollment.populate({ path: 'courseId', select: '-modules -quiz' }) });
});

export const myEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ studentId: req.user._id }).populate('courseId', '-modules -quiz').sort({ date: -1 });
  // ignore enrollments whose course was removed
  const valid = enrollments.filter((e) => e.courseId);
  const completed = valid.filter((e) => e.status === 'Completed').length;
  const overall = valid.length ? Math.round(valid.reduce((s, e) => s + e.progress, 0) / valid.length) : 0;
  res.json({
    enrollments: valid,
    stats: { enrolledCount: valid.length, completedCount: completed, overallProgress: overall },
  });
});

export const unenroll = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) throw new HttpError(404, 'Enrollment not found');
  if (String(enrollment.studentId) !== String(req.user._id)) throw new HttpError(403, 'Not your enrollment');
  await enrollment.deleteOne();
  res.json({ message: 'Unenrolled successfully' });
});

export const allEnrollments = asyncHandler(async (_req, res) => {
  const enrollments = await Enrollment.find().populate('studentId', 'name email').populate('courseId', 'title').sort({ date: -1 });
  res.json({ count: enrollments.length, enrollments });
});
