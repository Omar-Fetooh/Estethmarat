import mongoose from 'mongoose';

const suggestedCompany = new mongoose.Schema({
  investor_id: {
    type: Number,
    ref: 'Investor',
    required: true,
  },
  recommendations: {
    type: [Number],
    required: true,
  },
});

export const SuggestedCom = mongoose.model('SuggestedCom', suggestedCompany);
