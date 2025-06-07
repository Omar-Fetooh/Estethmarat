import express, { Router } from 'express';
import {
  createComment,
  answerComment,
  getCommentsForCompany,
  getCommentsOfInvestor,
} from './comment.controller.js';
import { protect } from '../auth/authController.js';

export const commentRouter = Router();

commentRouter.post('/', protect, createComment); // Investor asks question
commentRouter.patch('/:id/answer', protect, answerComment); // Company answers
commentRouter.get('/', getCommentsForCompany); // Get all questions for a company
commentRouter.get('/investors', getCommentsOfInvestor); // Get all comments of an investor
