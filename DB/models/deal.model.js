import mongoose from 'mongoose';
const dealSchema = new mongoose.Schema({
  investorId: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Deal must belong to an investor'],
  },
  companyId: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Deal must belong to a company'],
  },
  offerDetails: String,
  status: {
    type: String,
    enum: {
      values: [
        'Pending',
        'Negotiating',
        'Approved',
        'Completed',
        'Cancelled',
        'Closed',
        'Failed',
        'In Progress',
      ],
      message: `a {VALUE} is not defined please chose from these values ('Pending',
        'Negotiating',
        'Approved',
        'Completed',
        'Cancelled',
        'Closed',
        'Failed',
        'In Progress')`,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
export const Deal = mongoose.model('Deal', dealSchema);
