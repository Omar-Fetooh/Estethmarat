import { Review } from '../../../DB/models/index.js';
import { AppError } from '../../Utils/index.js';

export const addReview = async (req, res, next) => {
  const { reviewerId, reviewerType, companyId, rating, feedback } = req.body;

  if (reviewerType != 'Investor' && reviewerType != 'Organization') {
    return next(new AppError('invalid reviewer Type', 400));
  }

  const reviewedBefore = await Review.findOne({
    reviewerId,
    companyId,
  });

  if (reviewedBefore)
    return next(new AppError('you can only review one time', 400));

  const review = await Review.create({
    reviewerId,
    reviewerType,
    companyId,
    rating,
    feedback,
  });

  res.status(201).json({ message: 'Review added successfully', review });
};

export const getAllReviews = async (req, res, next) => {
  const { companyId } = req.query;
  const reviews = await Review.find({ companyId: companyId });

  // console.log(companyId);

  res
    .status(200)
    .json({ message: 'All reviews fetched successfully', reviews });
};

export const getReviewById = async (req, res, next) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) return next(new AppError('Review not found', 404));

  res.status(200).json({ message: 'review fetched successfully', review });
};

export const updateReviewById = async (req, res, next) => {
  const { reviewId } = req.params;
  const { reviewerType, companyId, rating, feedback } = req.body;

  const review = await Review.findById(reviewId);

  if (!review) return next(new AppError('Review not found', 404));

  if (reviewerType) review.reviewerType = reviewerType;
  if (companyId) review.company = companyId;
  if (rating) review.rating = rating;
  if (feedback) review.reviewText = feedback;

  await review.save();

  res.status(200).json({ message: 'Review updated successfully', review });
};

export const deleteReviewById = async (req, res, next) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) return next(new AppError('Review not found', 404));

  await review.deleteOne();

  res.status(200).json({ message: 'Review deleted successfully', review });
};

export const getAvgRating = async (req, res, next) => {
  const { companyId } = req.query;

  if (!companyId) {
    return res.status(400).json({ message: 'companyId is required' });
  }
  const reviews = await Review.find({ companyId });

  if (reviews.length === 0) {
    return res.status(200).json({ avgRating: 0 });
  }

  const sum = reviews.reduce((acc, curr) => {
    return acc + curr.rating;
  }, 0);

  console.log({ sum });

  const avgRating = sum / reviews.length;

  res.status(200).json({ avgRating });
};
