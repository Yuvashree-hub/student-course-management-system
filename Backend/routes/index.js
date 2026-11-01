// backend/routes/index.js
// Aggregates every API router. Mounted at both /api and /api/v1 in server.js.
import express from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import studentRoutes from './studentRoutes.js';
import courseRoutes from './courseRoutes.js';
import enrollmentRoutes from './enrollmentRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import messageRoutes from './messageRoutes.js';
import statsRoutes from './statsRoutes.js';
import learningRoutes from './learningRoutes.js';

const router = express.Router();

router.use('/', healthRoutes); // GET /api/health
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/learning', learningRoutes);
router.use('/notifications', notificationRoutes);
router.use('/messages', messageRoutes);
router.use('/stats', statsRoutes);

export default router;
