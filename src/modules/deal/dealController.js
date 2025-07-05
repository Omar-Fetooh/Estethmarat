import { Deal, Investor, Review } from '../../../DB/models/index.js';
import { AppError } from '../../Utils/AppError.js';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';
// create deal
export const createDeal = errorHandler(async (req, res, next) => {
  console.log(req.user);
  
  const  investorId  = req.user._id;
  const { companyId, offerDetails, status } = req.body;

  const investor = await Investor.findById(investorId);

  console.log(investorId,investor);
  

  if (!investor) {
    return next(new AppError('no investor with this id', 404));
  }

  const deal = await Deal.create({
    companyId,
    offerDetails,
    status,
    investorId,
  });

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

// get all deals of an investor
export const getAllDealsOfInvestor = errorHandler(async (req, res, next) => {
  const { investorId } = req.query;
  const allDeals = await Deal.find({ investorId }).populate('companyId');

  if (!allDeals || allDeals.length === 0) {
    return next(new AppError('There is no deal for this investor yet', 404));
  }

  const finalAllDeals = await Promise.all(
    allDeals.map(async (deal) => {
      const companyId = deal.companyId?._id;
      let avgRating = 0;

      if (companyId) {
        const reviews = await Review.find({ companyId });

        if (reviews.length > 0) {
          const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
          avgRating = sum / reviews.length;
        }
      }

      return {
        ...deal.toObject(),
        avgRating,
      };
    })
  );

  res.status(200).json({
    status: 'success',
    data: {
      allDeals: finalAllDeals,
    },
  });
});
