import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { AppError } from '../../Utils/AppError.js';
// import { Question } from '../../../DB/models/index';
import { Question } from './../../../DB/models/index.js';
// create question
export const createQuestion = errorHandler(async (req, res, next) => {
  // create question
  const question = await Question.create(req.body);
  // send response
  res.status(201).json({
    status: 'success',
    data: {
      question,
    },
  });
});

// get all questions
export const getAllQuestions = errorHandler(async (req, res, next) => {
  // get all questions
  const questions = await Question.find();
  // send response
  res.status(200).json({
    status: 'success',
    result: questions.length,
    data: {
      questions,
    },
  });
});

// get question based on id
export const getQuestion = errorHandler(async (req, res, next) => {
  // get question based on id
  const question = await Question.findById(req.params.questionId);
  // check if there is question with that id
  if (!question)
    return next(new AppError('there no question with that id', 404));
  // send response
  res.status(200).json({
    status: 'success',
    data: {
      question,
    },
  });
});

// update question based on id
export const updateQuestion = errorHandler(async (req, res, next) => {
  // check if ther is question with that id
  const question = await Question.findById(req.params.questionId);
  if (!question)
    return next(new AppError('there is no question with that id', 404));
  // update question based on id
  const updatedQuestion = await Question.findByIdAndUpdate(
    req.params.questionId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  // send response
  res.status(200).json({
    status: 'success',
    data: {
      updatedQuestion,
    },
  });
});

// delete question based on id
export const deleteQuestion = errorHandler(async (req, res, next) => {
  // check if there is question with that id
  const question = await Question.findById(req.params.questionId);
  if (!question)
    return next(new AppError('there is no question with that id', 404));
  // delete question based on id
  await Question.findByIdAndDelete(req.params.questionId);
  // send response
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
