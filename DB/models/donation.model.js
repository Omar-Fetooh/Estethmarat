import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const donationSchema = new Schema(
  {
    organizationId: {
      type: mongoose.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'OrganizationId is required'],
    },
    investorId: {
      type: mongoose.Types.ObjectId,
      ref: 'Investor',
      required: [true, 'investorId is required'],
    },
    amount: {
      type: Number,
      required: [true, 'amount is required'],
      min: [1, 'Donation amount must be at least 1'],
    },
  },
  { timestamps: true }
);

export const Donation =
  mongoose.models.Donation || model('Donation', donationSchema);
