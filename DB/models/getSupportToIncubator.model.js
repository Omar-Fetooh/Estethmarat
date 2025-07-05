import mongoose, { mongo } from 'mongoose';

const getSupportToIncubatorSchema = new mongoose.Schema({
  requestType: {
    type: String,
    default: 'support-incubator',
  },
  message: {
    type: String,
    default: '',
  },
  IsSeenByIncubator: {
    type: Boolean,
    default: false,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
});
export const SupportToIncubator = mongoose.model(
  'SupportToIncubator',
  getSupportToIncubatorSchema
);
