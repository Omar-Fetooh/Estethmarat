import mongoose from 'mongoose';

const similarCompanies = new mongoose.Schema({
  company_id: {
    type: Number,
    ref: 'Company',
    required: true,
  },
  similar_company_id: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
  },
});
export const SimilarComp = mongoose.model('SimilarComp', similarCompanies);
