import mongoose from 'mongoose';

const threeInvestorsSchema = new mongoose.Schema({
  investorid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investor',
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

export const TopThreeInvestor = mongoose.model(
  'TopThreeInvestor',
  threeInvestorsSchema
);
