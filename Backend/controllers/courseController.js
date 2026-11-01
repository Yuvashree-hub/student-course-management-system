// backend/controllers/courseController.js
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { HttpError } from '../utils/HttpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notifyAllStudents } from '../services/notificationService.js';

const pick = (body) => {
  const out = {};
  for (const f of ['title', 'description', 'duration', 'instructor']) {
    if (body[f] === undefined) continue;
    if (f === 'instructor' && !String(body[f]).trim()) continue; // keep the default instructor
    out[f] = body[f];
  }
  if (body.modules !== undefined) {
    out.modules = body.modules.map((m) => ({
      ...(mongoose.isValidObjectId(m.id) ? { _id: m.id } : {}), // keep the id of existing modules so student progress is not lost
      title: m.title,
      content: m.content,
      videoUrl: m.videoUrl || '',
    }));
  }
  if (body.quiz !== undefined) {
    out.quiz = body.quiz.map((q) => ({ question: q.question, options: q.options, correctIndex: q.correctIndex }));
  }
  return out;
};

export const listCourses = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.search) {
    filter.title = new RegExp(String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  }
  const courses = await Course.find(filter).sort({ createdAt: -1 });
  res.json({ count: courses.length, courses });
});

export const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new HttpError(404, 'Course not found');
  res.json({ course });
});

// Admin only: the full course including lesson text and correct quiz answers (for the editor)
export const getCourseFull = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) throw new HttpError(404, 'Course not found');
  res.json({ course: course.toAdminJSON() });
});

export const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(pick(req.body));
  // real-time notification to every student
  notifyAllStudents({
    title: 'New course available',
    message: `"${course.title}" (${course.duration}) was just added. Enroll now!`,
    type: 'course',
  }).catch((e) => console.error('notify failed:', e.message));
  res.status(201).json({ message: 'Course created successfully', course });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, pick(req.body), {
    new: true,
    runValidators: true,
  });
  if (!course) throw new HttpError(404, 'Course not found');
  res.json({ message: 'Course updated successfully', course });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) throw new HttpError(404, 'Course not found');
  await Enrollment.deleteMany({ courseId: course._id });
  res.json({ message: 'Course deleted successfully' });
});
