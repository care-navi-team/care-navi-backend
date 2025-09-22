import express from 'express';
import userRoutes from './userRoutes';
import careRoutes from './careRoutes';
import surveyRoutes from './surveyRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/care', careRoutes);
router.use('/surveys', surveyRoutes);

export default router;