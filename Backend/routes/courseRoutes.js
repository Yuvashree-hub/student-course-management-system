// backend/routes/courseRoutes.js
import express from 'express';
import { listCourses, getCourse, getCourseFull, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import authMiddleware, { restrictTo } from '../middleware/authMiddleware.js';
import { validateCourseCreate, validateCourseUpdate } from '../middleware/courseValidation.js';

const router = express.Router();

// Public catalog
router.get('/', listCourses);
router.get('/:id', getCourse);
router.get('/:id/full', authMiddleware, restrictTo('admin'), getCourseFull); // editor data (admin only)

// Course management: admin only
router.post('/', authMiddleware, restrictTo('admin'), validateCourseCreate, createCourse);
router.put('/:id', authMiddleware, restrictTo('admin'), validateCourseUpdate, updateCourse);
router.patch('/:id', authMiddleware, restrictTo('admin'), validateCourseUpdate, updateCourse);
router.delete('/:id', authMiddleware, restrictTo('admin'), deleteCourse);

export default router;
