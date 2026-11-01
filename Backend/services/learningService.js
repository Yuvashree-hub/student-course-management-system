// backend/services/learningService.js
// Pure learning rules (no database access) so they are easy to test.
export const QUIZ_SIZE = 5;
export const PASS_MARK = 3; // 3 out of 5 to pass
const MODULE_WEIGHT = 80; // finishing all modules = 80% progress, passing the quiz = the last 20%

export const quizReady = (course) => course.quiz.length === QUIZ_SIZE;

// ids of completed modules that still exist in the course (admins may delete modules later)
export function doneModuleIds(enrollment, course) {
  const valid = new Set(course.modules.map((m) => String(m._id)));
  return [...new Set(enrollment.completedModules.map(String))].filter((id) => valid.has(id));
}

export const allModulesDone = (enrollment, course) =>
  course.modules.length > 0 && doneModuleIds(enrollment, course).length === course.modules.length;

export function computeProgress(enrollment, course) {
  if (enrollment.status === 'Completed') return { progress: 100, status: 'Completed' };
  const total = course.modules.length;
  const done = doneModuleIds(enrollment, course).length;
  const progress = total ? Math.round((MODULE_WEIGHT * done) / total) : 0;
  return { progress, status: progress > 0 ? 'In Progress' : 'Not Started' };
}

export const validAnswers = (answers, quiz) =>
  Array.isArray(answers) &&
  answers.length === quiz.length &&
  answers.every((a) => Number.isInteger(a) && a >= 0 && a <= 3);

// Returns the score and WHICH questions were wrong (never the correct answers)
export function gradeQuiz(quiz, answers) {
  const wrong = [];
  let score = 0;
  quiz.forEach((q, i) => {
    if (answers[i] === q.correctIndex) score += 1;
    else wrong.push(i);
  });
  return { score, total: quiz.length, passed: score >= PASS_MARK, passMark: PASS_MARK, wrong };
}
