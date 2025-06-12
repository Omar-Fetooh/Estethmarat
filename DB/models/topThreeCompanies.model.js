import mongoose from 'mongoose';

const threeCompainesSchema = new mongoose.Schema({
  companyid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const TopThreeCompany = mongoose.model(
  'TopThreeCompany',
  threeCompainesSchema
);
