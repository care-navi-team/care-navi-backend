import express from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import fileRoutes from './fileRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/files', fileRoutes);

export default router;