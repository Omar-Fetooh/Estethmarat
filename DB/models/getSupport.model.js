import mongoose from 'mongoose';
const getSupportSchema = new mongoose.Schema({
  requestType: {
    type: String,
    default: 'support-charity',
  },
  contentMsg: {
    type: String,
    default: '',
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
  supporterRole: {
    type: String,
    default: '',
  },
  supporterId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'supporterRole',
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
});
export const GetSupporting = mongoose.model('GetSupporting', getSupportSchema);
