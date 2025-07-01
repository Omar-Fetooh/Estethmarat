import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  consultationType: {
    type: String,
    default: 'consultation-request',
  },
  content: {
    type: String,
    required: true,
  },
  investorIsReplied: {
    type: Boolean,
    default: false,
  },
  investorReplied: {
    type: String,
    default: '',
  },
  IsSeenByInvestor: {
    type: Boolean,
    default: false,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Investor',
  },
  IsRepliesSeenByCompany: {
    type: Boolean,
    default: false,
  },
});

export const RequestConsultation = mongoose.model(
  'RequestConsultation',
  consultationSchema
);
