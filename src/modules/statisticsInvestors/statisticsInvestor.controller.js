import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { TopThreeInvestor } from './../../../DB/models/topThreeInvestors.model.js';

export const getTopThreeInvestors = errorHandler(async (req, res, next) => {
  const topThreeInvestors = await TopThreeInvestor.find()
    .populate({
      path: 'investorid',
      select: '-__v',
    })
    .select('-__v');

  res.status(200).json({
    status: 'success',
    data: {
      investor: topThreeInvestors,
    },
  });
});
