import mongoose from 'mongoose';
const consultationSchema = new mongoose.Schema({
  investor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Investor',
    required: [true, 'conslutation must belong to investor'],
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: [true, 'conslutation must belong to company'],
  },
  status: {
    type: String,
    enum: [
      'pending',
      'approved',
      'rejected',
      'in-progress',
      'completed',
      'cancled',
    ],
    default: 'pending',
  },
  consultationContent: {
    type: String,
    required: [true, 'consultation must have content text'],
    minlength: 15,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Consultation = mongoose.model('Consultation', consultationSchema);
