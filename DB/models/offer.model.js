import mongoose from 'mongoose';
const offerSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      // default: 'عرض مالي',
    },
    company: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
      required: [true, 'specify the company in your offer'],
    },
    investor: {
      type: mongoose.Schema.ObjectId,
      ref: 'Investor',
      required: [true, 'specify the investor in your offer'],
    },
    content: {
      type: String,
      required: [true, 'specify the content of your offer'],
      minlength: 0,
    },
    response: {
      type: String,
      minlength: 0,
    },
    companyResponded: {
      type: Boolean,
      default: false,
    },
    companySeen: {
      type: Boolean,
      default: false,
    },
    investorSeenResponse: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Offer = mongoose.model('Offer', offerSchema);
