import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: [true, 'Specify the company for your comment/question.'],
  },
  investorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Investor',
    required: [true, 'Specify the investor who wrote the comment/question.'],
  },
  questionText: {
    type: String,
    required: [true, 'Please write your question.'],
    minlength: 1,
  },
  answerText: {
    type: String,
    // minlength: 1,
    default: '', // initially empty until the company answers
  },
  status: {
    type: String,
    enum: ['pending', 'answered', 'rejected', 'closed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Comment = mongoose.model('Comment', commentSchema);
