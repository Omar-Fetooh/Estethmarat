
import { Comment } from '../../../DB/models/index.js';
import { AppError } from '../../Utils/AppError.js';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';

// Investor asks a question
export const createComment = errorHandler(async (req, res, next) => {
  const { companyId, investorId, questionText } = req.body;

  if (!companyId || !questionText) {
    return res.status(400).json({
      status: 'fail',
      message: 'companyId and questionText are required',
    });
  }

  const comment = await Comment.create({
    companyId: companyId,
    investorId: investorId,
    questionText,
  });

  res.status(201).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

// Company answers a question
export const answerComment = errorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { answerText } = req.body;

  if (!answerText) {
    return res.status(400).json({
      status: 'fail',
      message: 'answerText is required',
    });
  }

  const comment = await Comment.findById(id);

  if (!comment) {
    return res.status(404).json({
      status: 'fail',
      message: 'Comment not found',
    });
  }

  comment.answerText = answerText;
  comment.status = 'answered';
  await comment.save();

  res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

// Get all comments/questions for a specific company
export const getCommentsForCompany = errorHandler(async (req, res, next) => {
  const { companyId } = req.query;

  if (!companyId) {
    return res.status(400).json({
      status: 'fail',
      message: 'companyId is required in query params',
    });
  }

  const comments = await Comment.find({ companyId: companyId })
    .populate('investorId') 
    .sort({ createdAt: -1 }); // newest first

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  });
});
