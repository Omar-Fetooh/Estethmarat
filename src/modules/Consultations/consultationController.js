import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { AppError } from '../../Utils/AppError.js';
// import { Consultation } from './../../../DB/models/index';
import { Consultation } from './../../../DB/models/index.js';
// create consultation
export const createConsultation = errorHandler(async (req, res, next) => {
  // create consultation
  const consultation = await Consultation.create(req.body);
  // send response
  res.status(201).json({
    status: 'success',
    data: {
      consultation,
    },
  });
});

// get all consultations
export const getAllConsultations = errorHandler(async (req, res, next) => {
  // get all consultations
  const consultations = await Consultation.find();
  // send response
  res.status(200).json({
    status: 'success',
    result: consultations.length,
    data: {
      consultations,
    },
  });
});

// get consultation based on id
export const getConsultation = errorHandler(async (req, res, next) => {
  // get consultation based on id
  const consultation = await Consultation.findById(req.params.consultationId);
  // check if there is consultation with that id
  if (!consultation)
    return next(new AppError('there no consultation with that id', 404));
  // send response
  res.status(200).json({
    status: 'success',
    data: {
      consultation,
    },
  });
});

// update consultation based on id
export const updateConsultation = errorHandler(async (req, res, next) => {
  // check if ther is consultation with that id
  const consultation = await Consultation.findById(req.params.consultationId);
  if (!consultation)
    return next(new AppError('there is no consultation with that id', 404));
  // update consultation based on id
  const updatedConsultation = await Consultation.findByIdAndUpdate(
    req.params.consultationId,
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
      updatedConsultation,
    },
  });
});

// delete consultation based on id
export const deleteConsultation = errorHandler(async (req, res, next) => {
  // check if there is consultation with that id
  const consultation = await Consultation.findById(req.params.consultationId);
  if (!consultation)
    return next(new AppError('there is no consultation with that id', 404));
  // delete consultation based on id
  await Consultation.findByIdAndDelete(req.params.consultationId);
  // send response
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
