import mongoose from 'mongoose';

const threeCompainesSchema = new mongoose.Schema({
  companyid: {
    type: Number,
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
