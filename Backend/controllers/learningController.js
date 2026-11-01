// backend/controllers/learningController.js
import mongoose from 'mongoose';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import { HttpError } from '../utils/HttpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notifyUser } from '../services/notificationService.js';
import {
  PASS_MARK,
  QUIZ_SIZE,
  quizReady,
  doneModuleIds,
  allModulesDone,
  computeProgress,
  validAnswers,
  gradeQuiz,
} from '../services/learningService.js';

// Loads the enrollment + course and makes sure the enrollment belongs to the logged-in student
async function loadOwned(req) {
  const { enrollmentId } = req.params;
  if (!mongoose.isValidObjectId(enrollmentId)) throw new HttpError(400, 'Invalid enrollment id');
  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) throw new HttpError(404, 'Enrollment not found');
  if (String(enrollment.studentId) !== String(req.user._id)) throw new HttpError(403, 'This is not your enrollment');
  const course = await Course.findById(enrollment.courseId);
  if (!course) throw new HttpError(404, 'This course no longer exists');
  return { enrollment, course };
}

// What the student's browser receives. Correct answers are NEVER included.
function buildPayload(enrollment, course) {
  const done = doneModuleIds(enrollment, course);
  const completed = enrollment.status === 'Completed';
  const unlocked = completed || allModulesDone(enrollment, course);
  const ready = quizReady(course);

  return {
    enrollment: {
      id: enrollment._id,
      status: enrollment.status,
      progress: enrollment.progress,
      quizAttempts: enrollment.quizAttempts,
      bestScore: enrollment.bestScore,
      lastScore: enrollment.lastScore,
      passedAt: enrollment.passedAt || null,
    },
    course: {
      id: course._id,
      title: course.title,
      description: course.description,
      duration: course.duration,
      instructor: course.instructor,
      quizReady: ready,
      modules: course.modules.map((m) => ({
        id: m._id,
        title: m.title,
        content: m.content,
        videoUrl: m.videoUrl || '',
        completed: done.includes(String(m._id)),
      })),
    },
    unlocked,
    quiz:
      unlocked && ready && !completed
        ? {
            passMark: PASS_MARK,
            total: QUIZ_SIZE,
            questions: course.quiz.map((q, index) => ({ index, question: q.question, options: q.options })),
          }
        : null,
  };
}

export const getLearning = asyncHandler(async (req, res) => {
  const { enrollment, course } = await loadOwned(req);
  res.json(buildPayload(enrollment, course));
});

export const completeModule = asyncHandler(async (req, res) => {
  const { enrollment, course } = await loadOwned(req);
  const { moduleId } = req.params;
  if (!course.modules.some((m) => String(m._id) === moduleId)) throw new HttpError(404, 'Module not found');

  // already finished the course: nothing to change
  if (enrollment.status !== 'Completed') {
    if (!enrollment.completedModules.map(String).includes(moduleId)) enrollment.completedModules.push(moduleId);
    const { progress, status } = computeProgress(enrollment, course);
    enrollment.progress = progress;
    enrollment.status = status;
    await enrollment.save();
  }
  res.json({ message: 'Module marked as complete', ...buildPayload(enrollment, course) });
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const { enrollment, course } = await loadOwned(req);

  if (enrollment.status === 'Completed') throw new HttpError(400, 'You have already passed this course');
  if (!quizReady(course)) throw new HttpError(400, 'The quiz for this course is not available yet');
  if (!allModulesDone(enrollment, course)) throw new HttpError(403, 'Complete all modules before taking the quiz');

  const answers = req.body?.answers;
  if (!validAnswers(answers, course.quiz)) throw new HttpError(400, `Please answer all ${QUIZ_SIZE} questions`);

  const result = gradeQuiz(course.quiz, answers); // grading happens only on the server
  enrollment.quizAttempts += 1;
  enrollment.lastScore = result.score;
  enrollment.bestScore = Math.max(enrollment.bestScore || 0, result.score);
  if (result.passed) {
    enrollment.passedAt = new Date();
    enrollment.status = 'Completed';
    enrollment.progress = 100;
  }
  await enrollment.save();

  if (result.passed) {
    await notifyUser(req.user._id, {
      title: 'Course completed 🎉',
      message: `You passed the "${course.title}" quiz (${result.score}/${result.total}). Your certificate is ready!`,
      type: 'course',
    });
  }
  res.json({ result, ...buildPayload(enrollment, course) });
});
