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
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'specify the sender in your offer'],
      refPath: 'senderModel',
    },
    senderModel: {
      type: String,
      required: true,
      enum: ['Investor', 'Company'],
    },
    content: {
      type: String,
      required: [true, 'specify the content of your offer'],
      minlength: 0,
    },
    serviceType: {
      type: String,
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
    responseSeenBySender: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Offer = mongoose.model('Offer', offerSchema);
