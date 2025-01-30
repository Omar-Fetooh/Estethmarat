import { Company } from "../../../DB/models/index.js";
import { AppError } from "../../Utils/AppError.js";

import { errorHandler } from "../../middlewares/error-handling.middleware.js";

export const getAllCompanies = errorHandler(async (req, res, next) => {
  const companies = await Company.find();
  res.status(200).json({
    status: "success",
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
    status: "success",
    data: {
      company: newCompany,
    },
  });
});
export const getCompany = errorHandler(async (req, res, next) => {
  const company = await Company.findById(req.params.id);
  if (!company)
    return next(new AppError("There is no company with this id", 404));
  res.status(200).json({
    status: "success",
    data: {
      company,
    },
  });
});
export const updateCompany = errorHandler(async (req, res, next) => {
  // get the company with id at first
  const gettedCompany = await Company.findById(req.params.id);
  if (!gettedCompany)
    return next(new AppError("There is no company with this id", 404));
  const updatedCompany = await Company.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      company: updatedCompany,
    },
  });
});
export const deleteCompany = errorHandler(async (req, res, next) => {
  const gettedCompany = await Company.findById(req.params.id);
  if (!gettedCompany)
    return next(new AppError("There is no company with this id", 404));
  await Company.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
