import { Router } from 'express';

import * as middlewares from '../../middlewares/index.js';
import {
  addReview,
  deleteReviewById,
  getAllReviews,
  getAvgRating,
  getReviewById,
  updateReviewById,
} from './review.controller.js';
export const reviewRouter = Router();

const { auth } = middlewares;

const { errorHandler } = middlewares;

reviewRouter.post('/', errorHandler(addReview));
reviewRouter.get('/', errorHandler(getAllReviews));

// reviewRouter.get('/:reviewId', errorHandler(getReviewById));
// reviewRouter.patch('/:reviewId', errorHandler(updateReviewById));
// reviewRouter.delete('/:reviewId', errorHandler(deleteReviewById));

reviewRouter.get('/avg-rating', errorHandler(getAvgRating));
