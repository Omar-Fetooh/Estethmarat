import express from 'express';
import {
  createConsultation,
  deleteConsultation,
  getAllConsultations,
  getConsultation,
  updateConsultation,
} from './consultationController.js';

export const consultationRouter = express.Router();

consultationRouter.route('/').post(createConsultation).get(getAllConsultations);

consultationRouter
  .route('/:consultationId')
  .get(getConsultation)
  .patch(updateConsultation)
  .delete(deleteConsultation);
