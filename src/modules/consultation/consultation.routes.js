import { Router } from 'express';
import { createRequestConsultation } from './consultationController.js';
import { upload } from '../auth/authController.js';
export const requestConsultationRouter = Router();

requestConsultationRouter.post(
  '/:investorId',
  upload.none(),
  createRequestConsultation
);
