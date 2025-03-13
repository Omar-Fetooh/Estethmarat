import { Company } from '../../../DB/models/index.js';
import { AppError } from '../../Utils/AppError.js';
import { APIFEATURES } from '../../Utils/apiFeatures.js';

import { errorHandler } from '../../middlewares/error-handling.middleware.js';

export const getAllCompanies = errorHandler(async (req, res, next) => {
  const obj = new APIFEATURES(req.query, Company.find())
    .filter()
    .selectFields()
    .sortFields()
    .paginate();

  const companies = await obj.query;
  res.status(200).json({
    status: 'success',
    results: companies.length,
    data: {
      companies,
    },
  });
});
export const createCompany = errorHandler(async (req, res, next) => {
  const newCompany = await Company.create(req.body);
  newCompany.password = undefined;
  res.status(201).json({
    status: 'success',
    data: {
      company: newCompany,
    },
  });
});
export const getCompany = errorHandler(async (req, res, next) => {
  const company = await Company.findById(req.params.id);
  if (!company)
    return next(new AppError('There is no company with this id', 404));
  res.status(200).json({
    status: 'success',
    data: {
      company,
    },
  });
});
export const updateCompany = errorHandler(async (req, res, next) => {
  // get the company with id at first
  const gettedCompany = await Company.findById(req.params.id);
  if (!gettedCompany)
    return next(new AppError('There is no company with this id', 404));
  const updatedCompany = await Company.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      company: updatedCompany,
    },
  });
});
export const deleteCompany = errorHandler(async (req, res, next) => {
  const gettedCompany = await Company.findById(req.params.id);
  if (!gettedCompany)
    return next(new AppError('There is no company with this id', 404));
  await Company.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
// get top five companines based on their net profit
export const getTopCompanies = errorHandler(async (req, res, next) => {
  const topCompanies = await Company.aggregate([
    {
      $sort: { netProfit: -1 },
    },
    {
      $project: { companyName: 1, comapnyPhoto: 1, netProfit: 1, _id: 0 },
    },
    {
      $limit: 5,
    },
  ]);
  res.status(200).json({
    status: 'success',
    topCompanies,
  });
});
