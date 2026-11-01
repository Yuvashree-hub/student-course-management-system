// backend/routes/enrollmentRoutes.js
import express from 'express';
import { enroll, myEnrollments, unenroll, allEnrollments } from '../controllers/enrollmentController.js';
import authMiddleware, { restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', restrictTo('admin'), allEnrollments);
router.get('/me', myEnrollments);
router.post('/', restrictTo('student'), enroll);
router.delete('/:id', restrictTo('student'), unenroll);

export default router;
