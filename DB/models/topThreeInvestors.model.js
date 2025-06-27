import mongoose from 'mongoose';

const threeInvestorsSchema = new mongoose.Schema({
  investor_id: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const TopThreeInvestor = mongoose.model(
  'TopThreeInvestor',
  threeInvestorsSchema
);
