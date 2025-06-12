import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { TopThreeCompany } from './../../../DB/models/topThreeCompanies.model.js';
import { TopThreeInvestor } from './../../../DB/models/topThreeInvestors.model.js';

export const getTopThreeCompanies = errorHandler(async (req, res, next) => {
  const topThreeCompanies = await TopThreeCompany.find()
    .populate({
      path: 'companyid',
      select: '-__v',
    })
    .select('-__v');

  res.status(200).json({
    status: 'success',
    data: {
      topThreeCompanies,
    },
  });
});
