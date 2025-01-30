const Company = require("./../models/companyModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
// get all companies
exports.getAllCompanies = catchAsync(async (req, res, next) => {
  const companies = await Company.find();
  res.status(200).json({
    status: "success",
    results: companies.length,
    data: {
      companies,
    },
  });
});
// create company
exports.createCompany = catchAsync(async (req, res, next) => {
  const newCompany = await Company.create(req.body);
  newCompany.password = undefined;
  res.status(201).json({
    status: "success",
    data: {
      company: newCompany,
    },
  });
});
// get a specific company based on a specific id
exports.getCompany = catchAsync(async (req, res, next) => {
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
// update a company based on it's id
exports.updateCompany = catchAsync(async (req, res, next) => {
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
// delete a company based on it's id
exports.deleteCompany = catchAsync(async (req, res, next) => {
  const gettedCompany = await Company.findById(req.params.id);
  if (!gettedCompany)
    return next(new AppError("There is no company with this id", 404));
  await Company.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
