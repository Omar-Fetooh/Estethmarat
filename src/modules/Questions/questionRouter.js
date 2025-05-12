import express from 'express';
import {
  createQuestion,
  deleteQuestion,
  getAllQuestions,
  getQuestion,
  updateQuestion,
} from './questionController.js';
import { protect } from '../auth/authController.js';

export const questionRouter = express.Router();

questionRouter.route('/').post(protect, createQuestion).get(getAllQuestions);

questionRouter
  .route('/:questionId')
  .get(getQuestion)
  .patch(updateQuestion)
  .delete(deleteQuestion);
