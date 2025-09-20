import express from 'express';
import userRoutes from './userRoutes';
import careRoutes from './careRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/care', careRoutes);

export default router;