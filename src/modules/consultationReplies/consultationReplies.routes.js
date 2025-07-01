import { Router } from 'express';
export const consultationRouterReplies = Router();
import {
  createConsultationReply,
  upload,
} from './consultationReplies.controller.js';
consultationRouterReplies.patch(
  '/:consultationId',
  upload.none(),
  createConsultationReply
);
