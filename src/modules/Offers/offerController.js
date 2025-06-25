import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { AppError } from '../../Utils/AppError.js';
import { Company, Investor, Offer } from '../../../DB/models/index.js';

export const createOffer = errorHandler(async (req, res, next) => {
  const { companyId } = req.query;

  const company = await Company.findById(companyId);
  if (!company) {
    return next(new AppError('Invalid company ID', 404));
  }

  const senderId = req.user._id;

  const isInvestor = await Investor.findById(senderId);
  const isCompany = !isInvestor ? await Company.findById(senderId) : null;

  if (!isInvestor && !isCompany) {
    return next(
      new AppError('Sender must be a valid Investor or Company', 404)
    );
  }

  req.body.company = companyId;
  req.body.sender = senderId;
  req.body.senderModel = isInvestor ? 'Investor' : 'Company';

  const offer = await Offer.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      offer,
    },
  });
});

// get all questions
export const getAllOffers = errorHandler(async (req, res, next) => {
  // get all questions
  const questions = await Offer.find();
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
export const getOffer = errorHandler(async (req, res, next) => {
  // get question based on id
  const question = await Offer.findById(req.params.questionId);
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

// update offer based on id
export const updateOffer = errorHandler(async (req, res, next) => {
  const offer = await Offer.findById(req.params.offerId);
  if (!offer) {
    return next(new AppError('There is no offer with that ID', 404));
  }

  const userId = req.user._id;
  const isCompany = userId.toString() === offer.company.toString();

  if (!isCompany) {
    return next(new AppError("You don't have permission to do this", 403));
  }

  // update offer content
  const updatedOffer = await Offer.findByIdAndUpdate(
    req.params.offerId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  updatedOffer.companySeen = true;
  updatedOffer.companyResponded = true;

  await updatedOffer.save();

  res.status(200).json({
    status: 'success',
    data: {
      updatedOffer,
    },
  });
});

// delete question based on id
export const deleteOffer = errorHandler(async (req, res, next) => {
  // check if there is question with that id
  const question = await Offer.findById(req.params.questionId);
  if (!question)
    return next(new AppError('there is no question with that id', 404));
  // delete question based on id
  await Offer.findByIdAndDelete(req.params.questionId);
  // send response
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
