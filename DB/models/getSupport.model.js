import mongoose from 'mongoose';

const getSupportSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'support-charity',
  },
  message: {
    type: String,
    default: '',
  },
  IsSeenByCharity: {
    type: Boolean,
    default: false,
  },
  supportIntroducer: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'supporterRole',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  supporterRole: {
    type: String,
  },
});

export const GetSupport = mongoose.model('GetSupport', getSupportSchema);
