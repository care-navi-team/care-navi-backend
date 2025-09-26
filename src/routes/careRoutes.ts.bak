import express from 'express';
import {
  getAllCareRequests,
  getCareRequestById,
  createCareRequest,
  updateCareRequest,
  deleteCareRequest,
  assignCaregiver
} from '../controllers/careController';

const router = express.Router();

router.route('/')
  .get(getAllCareRequests)
  .post(createCareRequest);

router.route('/:id')
  .get(getCareRequestById)
  .put(updateCareRequest)
  .delete(deleteCareRequest);

router.route('/:id/assign')
  .put(assignCaregiver);

export default router;