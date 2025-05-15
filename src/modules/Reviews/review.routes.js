import { Router } from 'express';

import * as middlewares from '../../middlewares/index.js';
import {
  addReview,
  deleteReviewById,
  getAllReviews,
  getAvgRating,
  getReviewById,
  getReviewStatusOfReviewer,
  updateReviewById,
} from './review.controller.js';
import { protect } from '../auth/authController.js';
export const reviewRouter = Router();

const { auth } = middlewares;

const { errorHandler } = middlewares;

reviewRouter.post('/', protect, errorHandler(addReview));
reviewRouter.get('/', errorHandler(getAllReviews));

reviewRouter.get('/avg-rating', errorHandler(getAvgRating));

// this endpoint check if this reviewer reviewed the same company or not and if it is it returns the review
reviewRouter.post('/:reviewerId', errorHandler(getReviewStatusOfReviewer));

// reviewRouter.get('/:reviewId', errorHandler(getReviewById));
// reviewRouter.patch('/:reviewId', errorHandler(updateReviewById));
// reviewRouter.delete('/:reviewId', errorHandler(deleteReviewById));

