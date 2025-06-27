import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { TopThreeInvestor } from './../../../DB/models/topThreeInvestors.model.js';
import { Investor } from '../../../DB/models/investor.model.js';

export const getTopThreeInvestors = errorHandler(async (req, res, next) => {
  const topThreeInvestors = await TopThreeInvestor.find()
    .sort({ score: -1 })
    .limit(3);
  const topInvestors = await Promise.all(
    topThreeInvestors.map(
      async (investor) =>
        await Investor.findOne({ recommendation_id: investor.investor_id })
    )
  );

  res.status(200).json({
    status: 'success',
    data: {
      investor: topInvestors,
    },
  });
});
