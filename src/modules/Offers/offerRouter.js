import express from 'express';
import {
  createOffer,
  updateOffer,
  // deleteQuestion,
  // getAllQuestions,
  // getQuestion,
} from './offerController.js';
import { protect } from '../auth/authController.js';

export const offerRouter = express.Router();

offerRouter.route('/').post(protect, createOffer)
// .get(getAllQuestions);

offerRouter
  .route('/:offerId')
  .patch(protect,updateOffer)
//   .get(getQuestion)
//   .delete(deleteQuestion);
