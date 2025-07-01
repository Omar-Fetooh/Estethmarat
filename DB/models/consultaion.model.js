import mongoose from 'mongoose';

const consultaionSchema = new mongoose.Schema({
  requestType: {
    type: String,
    default: 'Ask for consultation!',
  },
  consultationContent: {
    type: String,
    required: true,
  },
  investorIsReplied: {
    type: Boolean,
    default: false,
  },
  investorReply: {
    type: String,
    default: '',
  },
  consultaionState: {
    type: Boolean,
    default: false,
  },
  company: {
    type: mongoose.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  investor: {
    type: mongoose.Types.ObjectId,
    ref: 'Investor',
    required: true,
  },
  isRepliesSeenByCompany: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const requestConsultation = mongoose.model(
  'requestConsultation',
  consultaionSchema
);
