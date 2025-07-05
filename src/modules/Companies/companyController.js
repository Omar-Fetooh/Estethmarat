import {
  Company,
  Offer,
  requestConsultation,
  SimilarComp,
} from '../../../DB/models/index.js';
import { AppError } from '../../Utils/AppError.js';
import { APIFEATURES } from '../../Utils/apiFeatures.js';
import { createTokenAndSendCookie } from '../auth/authController.js';
import Joi from 'joi';

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
  const token = createTokenAndSendCookie(newCompany._id, newCompany.role, res);
  newCompany.password = undefined;
  res.status(201).json({
    status: 'success',
    data: {
      company: newCompany,
      token,
    },
  });
});
export const getCompany = errorHandler(async (req, res, next) => {
  const company = await Company.findById(req.params.id);
  if (!company)
    return next(new AppError('There is no company with this id', 404));

  const similarRelations = await SimilarComp.find({
    company_id: company.recommendation_id,
  });

  const similarCompanyIds = similarRelations.map(
    (relation) => relation.similar_company_id
  );

  let similarCompanies = [];
  if (similarCompanyIds.length > 0) {
    similarCompanies = await Company.find({
      recommendation_id: { $in: similarCompanyIds },
    });
  }
  const sortedRelations = similarRelations.sort((a, b) => b.score - a.score);

  const companyMap = new Map(
    (
      await Company.find({
        recommendation_id: { $in: similarCompanyIds },
      })
    ).map((c) => [c.recommendation_id, c])
  );

  const similarCompaniesSorted = sortedRelations
    .map((rel) => companyMap.get(rel.similar_company_id))
    .filter(Boolean);

  // console.log(similarCompanies);

  res.status(200).json({
    status: 'success',
    data: {
      company,
      similarCompaniesSorted,
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

export const saveProfile = async (req, res, next) => {
  const { profileId, profileType } = req.body;

  if (!profileId || !profileType) {
    return next(new AppError('profileId and profileType are required', 400));
  }

  const allowedTypes = [
    'Investor',
    'CharityOrganization',
    'SupportOrganization',
    'Company',
  ];
  if (!allowedTypes.includes(profileType)) {
    return next(new AppError('Invalid profile type', 400));
  }

  const companyId = req.user._id;

  const company = await Company.findById(companyId);

  if (!company) {
    return next(new AppError('company is not found', 404));
  }

  // Check if already saved
  const alreadySaved = company.savedProfiles.some(
    (profile) =>
      profile.profileId.toString() === profileId &&
      profile.profileType === profileType
  );

  if (alreadySaved) {
    return next(new AppError('Profile already saved', 400));
  }

  // Save the profile
  company.savedProfiles.push({
    profileId,
    profileType,
  });

  await company.save();

  res.status(200).json({
    status: 'success',
    message: 'Profile saved successfully',
    savedProfiles: company.savedProfiles,
  });
};
export const getAllSavedProfiles = async (req, res, next) => {
  console.log(req.user._id);

  const company = await Company.findById(req.user._id).populate({
    path: 'savedProfiles.profileId',
  });

  if (!company) {
    return next(new AppError('company is not found', 404));
  }

  res.status(200).json({
    status: 'success',
    count: company.savedProfiles.length,
    data: { savedProfiles: company.savedProfiles },
  });
};
export const getAllNotifications = errorHandler(async (req, res, next) => {
  const companyId = req.user.id;

  const [incomingOffers, respondedOutgoingOffers, consultations] =
    await Promise.all([
      Offer.find({ company: companyId }), // بجيب الي مبعوت للشركه
      Offer.find({ sender: companyId, companyResponded: true }), // بجيب عروض الخدمة الي الشركة باعتاها
      requestConsultation.find({
        company: companyId,
        investorReply: { $ne: '' },
      }),
    ]);

  const hasUnseenIncoming = incomingOffers.some(
    (offer) => offer.companySeen === false
  );
  const hasUnseenOutgoing = respondedOutgoingOffers.some(
    (offer) => offer.companyResponded === true
  );
  const hasUnseenConsultations = consultations.some(
    (cons) => cons.isRepliesSeenByCompany === false
  );

  const allSeen =
    !hasUnseenIncoming && !hasUnseenOutgoing && !hasUnseenConsultations;

  const allNotifications = [
    ...incomingOffers,
    ...respondedOutgoingOffers,
    ...consultations,
  ];

  return res.status(200).json({
    status: 'success',
    allSeen,
    allData: allNotifications,
  });
});
