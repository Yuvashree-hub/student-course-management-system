// backend/routes/learningRoutes.js
import express from 'express';
import { getLearning, completeModule, submitQuiz } from '../controllers/learningController.js';
import authMiddleware, { restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware, restrictTo('student'));

router.get('/:enrollmentId', getLearning);
router.post('/:enrollmentId/modules/:moduleId/complete', completeModule);
router.post('/:enrollmentId/quiz', submitQuiz);

export default router;
