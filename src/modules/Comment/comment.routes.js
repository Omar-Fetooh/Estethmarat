import express, { Router } from 'express';
import {
  createComment,
  answerComment,
  getCommentsForCompany,
} from './comment.controller.js';

export const commentRouter = Router();

commentRouter.post('/', createComment); // Investor asks question
commentRouter.patch('/:id/answer', answerComment); // Company answers
commentRouter.get('/', getCommentsForCompany); // Get all questions for a company

