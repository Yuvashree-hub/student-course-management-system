// backend/middleware/courseValidation.js
import { HttpError } from '../utils/HttpError.js';

// Optional lesson modules + quiz (quiz = exactly 5 questions, or empty)
function checkContent(body) {
  const { modules, quiz } = body || {};

  if (modules !== undefined) {
    if (!Array.isArray(modules) || modules.length > 20) return 'Modules must be a list (maximum 20)';
    for (const [i, m] of modules.entries()) {
      const n = i + 1;
      if (!m || typeof m.title !== 'string' || !m.title.trim() || m.title.length > 120) return `Module ${n}: a title is required (max 120 characters)`;
      if (typeof m.content !== 'string' || !m.content.trim() || m.content.length > 5000) return `Module ${n}: content is required (max 5000 characters)`;
      if (m.videoUrl !== undefined && m.videoUrl !== '' && (typeof m.videoUrl !== 'string' || !/^https?:\/\/\S+$/i.test(m.videoUrl))) {
        return `Module ${n}: the video link must start with http:// or https://`;
      }
    }
  }

  if (quiz !== undefined) {
    if (!Array.isArray(quiz) || (quiz.length !== 0 && quiz.length !== 5)) return 'The quiz must have exactly 5 questions (or be left empty)';
    for (const [i, q] of quiz.entries()) {
      const n = i + 1;
      if (!q || typeof q.question !== 'string' || q.question.trim().length < 3 || q.question.length > 300) return `Question ${n}: enter the question text (3-300 characters)`;
      if (!Array.isArray(q.options) || q.options.length !== 4 || q.options.some((o) => typeof o !== 'string' || !o.trim() || o.length > 150)) {
        return `Question ${n}: fill in all 4 options`;
      }
      if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3) return `Question ${n}: choose the correct answer`;
    }
  }
  return null;
}

function check(body, requireAll) {
  const { title, description, duration, instructor } = body || {};
  const fields = { title, description, duration };
  for (const [key, val] of Object.entries(fields)) {
    if (val === undefined) {
      if (requireAll) return `${key} is required`;
      continue;
    }
    if (typeof val !== 'string' || !val.trim()) return `${key} must be a non-empty text`;
  }
  if (title !== undefined && (title.length < 3 || title.length > 120)) return 'Title must be 3-120 characters';
  if (description !== undefined && description.length > 1000) return 'Description is too long (max 1000)';
  if (instructor !== undefined && typeof instructor !== 'string') return 'Instructor must be text';
  return checkContent(body);
}

export const validateCourseCreate = (req, _res, next) => {
  const msg = check(req.body, true);
  return msg ? next(new HttpError(400, msg)) : next();
};

export const validateCourseUpdate = (req, _res, next) => {
  const msg = check(req.body, false);
  return msg ? next(new HttpError(400, msg)) : next();
};
