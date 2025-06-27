import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { TopThreeCompany } from './../../../DB/models/topThreeCompanies.model.js';
import { Company } from '../../../DB/models/company.model.js';
export const getTopThreeCompanies = errorHandler(async (req, res, next) => {
  const topThreeCompanies = await TopThreeCompany.find()
    .sort({ score: -1 })
    .select('-__v -_id');
  const firstThree = topThreeCompanies.slice(0, 3);
  const finalTopThreeCompaines = await Promise.all(
    firstThree.map(async (item) => {
      const company = await Company.findOne({
        recommendation_id: item.companyid,
      });
      return { company, score: item.score };
    })
  );
  res.status(200).json({
    status: 'success',
    results: finalTopThreeCompaines.length,
    data: {
      finalTopThreeCompaines,
    },
  });
});
