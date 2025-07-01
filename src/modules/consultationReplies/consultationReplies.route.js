import { Router } from 'express';
import { upload } from '../auth/authController.js';
import { createConsultationReply } from './consultationController.js';
export const consultationReplyRouter = Router();

consultationReplyRouter.patch(
  '/:consultationId',
  upload.none(),
  createConsultationReply
);
