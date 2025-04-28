import { Deal } from '../../../DB/models/index.js';
import { AppError } from '../../Utils/AppError.js';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';
// create deal
export const createDeal = errorHandler(async (req, res, next) => {
  const deal = await Deal.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      deal,
    },
  });
});
// get all deals
export const getAllDeals = errorHandler(async (req, res, next) => {
  const deals = await Deal.find();
  res.status(200).json({
    status: 'success',
    result: deals.length,
    data: {
      deals,
    },
  });
});
// get a specific deal
export const getDeal = errorHandler(async (req, res, next) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) return next(new AppError('There is no deal with this id', 404));
  res.status(200).json({
    status: 'success',
    data: {
      deal,
    },
  });
});
// update deal
export const updateDeal = errorHandler(async (req, res, next) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) return next(new AppError('There is no deal with this id', 404));
  const updatedDeal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      deal: updatedDeal,
    },
  });
});
// delete deal
export const deleteDeal = errorHandler(async (req, res, next) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) return next(new AppError('There is no deal with this id', 404));
  await Deal.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

