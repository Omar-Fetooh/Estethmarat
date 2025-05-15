import {
  Review,
  Investor,
  supportOrganization,
} from '../../../DB/models/index.js';
import { AppError } from '../../Utils/index.js';

export const addReview = async (req, res, next) => {
  const { reviewerType, companyId, rating, feedback } = req.body;
  const reviewerId = req.user._id;

  console.log(supportOrganization);

  const investor = await Investor.findById(reviewerId);
  const supportOrg = await supportOrganization.findById(reviewerId);

  if (!investor && !supportOrg) {
    return next(new AppError('Invalid reviewerId', 404));
  }

  if (reviewerType !== 'investor' && reviewerType !== 'supportOrganization') {
    return next(new AppError('Invalid reviewer type', 400));
  }

  if (reviewerType === 'investor' && !investor) {
    return next(new AppError('You are not an Investor', 403));
  }
  if (reviewerType === 'Support Organization' && !supportOrg) {
    return next(new AppError('You are not a Support Organization', 403));
  }

  const reviewedBefore = await Review.findOne({ reviewerId, companyId });
  if (reviewedBefore) {
    return next(new AppError('You can only review one time', 400));
  }

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

  // console.log({ sum });

  const avgRating = sum / reviews.length;

  res.status(200).json({ avgRating });
};

export const getReviewStatusOfReviewer = async (req, res, next) => {
  const { reviewerId } = req.params;
  const { companyId } = req.body;

  const review = await Review.findOne({ reviewerId, companyId });

  if (!review) {
    return res
      .status(200)
      .json({ message: "the reviewer didn't review before " });
  }

  return res
    .status(200)
    .json({ review, message: 'review returned successfully' });
};
