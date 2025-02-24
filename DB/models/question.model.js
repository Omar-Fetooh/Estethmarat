import mongoose from 'mongoose';
const questionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    default: 0,
    required: [true, 'specify the amount !'],
    min: 0,
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: [true, 'specify the company in your question'],
  },
  investor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Investor',
    required: [true, 'specify the investor in your question'],
  },
  questionText: {
    type: String,
    required: [true, 'specify the content of your question'],
    minlength: 0,
  },
  answerText: {
    type: String,
    required: [true, 'specify your answer for your question'],
    minlength: 0,
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

export const Question = mongoose.model('Question', questionSchema);