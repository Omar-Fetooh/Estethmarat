import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      maxLength: 100,
      required: [true, 'title is required'],
    },
    content: {
      type: String,
      required: [true, 'content is required'],
    },
    organizationId: {
      type: mongoose.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'OrganizationId is required'],
    },
    attachedImage: {
      secure_url: {
        type: String,
        required: false,
      },
      public_id: {
        type: String,
        unique: true,
        required: false,
      },
    },
  },
  { timestamps: true }
);

export const Post = mongoose.models.Post || model('Post', postSchema);
