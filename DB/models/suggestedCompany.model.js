import mongoose, { Schema } from 'mongoose';

const suggestedCompany = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

export const SuggestedCom = mongoose.model('SuggestedCom', suggestedCompany);
