import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    companyId: {
      type: mongoose.Types.ObjectId,
      ref: 'Company',
      required: [true, 'companyId is required'],
    },
    reviewerId: {
      type: mongoose.Types.ObjectId,
      required: [true, 'reviewerId is required'],
      refPath: 'reviewerType', // Dynamically reference the correct model
    },
    reviewerType: {
      type: String,
      required: true,
      enum: ['investor', 'supportOrganization'], // Ensures only valid values
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'rating is required'],
    },
    feedback: {
      type: String,
      trim: true,
      // required: [true, 'feedback is required'],
    },
  },
  { timestamps: true }
);

// reviewSchema.index({ reviewerId: 1, company: 1 }, { unique: true }); // to ensure that every investor can review only once

export const Review = mongoose.models.Review || model('Review', reviewSchema);
