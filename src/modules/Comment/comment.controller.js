import { Comment, Investor } from '../../../DB/models/index.js';
import { AppError } from '../../Utils/AppError.js';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';

// Investor asks a question
export const createComment = errorHandler(async (req, res, next) => {
  const { companyId, questionText } = req.body;

  const investorId = req.user._id;
  const isValidInvestor = await Investor.findById(investorId);

  if (!isValidInvestor) return next(new AppError('invalid investor', 404));

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

  const comment = await Comment.findOne({ _id: id, companyId: req.user._id });
  // console.log(id,req.user._id);
  // console.log(comment);

  if (!comment) {
    return res.status(404).json({
      status: 'fail',
      message: 'Comment not found or you are not authenicated',
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

// Get all comments/questions for a specific company
export const getCommentsOfInvestor = errorHandler(async (req, res, next) => {
  const { investorId } = req.query;

  if (!investorId) {
    return res.status(400).json({
      status: 'fail',
      message: 'investorId is required in query params',
    });
  }

  const comments = await Comment.find({ investorId: investorId })
    .populate('companyId')
    .sort({ createdAt: -1 }); // newest first

  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  });
});
