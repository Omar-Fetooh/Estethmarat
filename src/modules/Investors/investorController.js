import jwt from 'jsonwebtoken';
import { Deal, Investor, Offer, requestConsultation } from '../../../DB/models/index.js';
import { AppError } from '../../Utils/AppError.js';
import { createTokenAndSendCookie } from '../auth/authController.js';
import { APIFEATURES } from '../../Utils/apiFeatures.js';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';

// investor register
export const register = errorHandler(async (req, res, next) => {
  // register new investor
  const newInvestor = await Investor.create(req.body);
  // create token
  const token = createTokenAndSendCookie(
    newInvestor._id,
    newInvestor.role,
    res
  );
  // to prevent send password in response
  newInvestor.password = undefined;
  // send response
  res.status(201).json({
    status: 'success',
    data: {
      newInvestor,
      token,
    },
  });
});

// get all investors
export const getAllInvestors = errorHandler(async (req, res, next) => {
  const obj = new APIFEATURES(req.query, Investor.find())
    .filter()
    .selectFields()
    .sortFields()
    .paginate();

  const investors = await obj.query;
  res.status(200).json({
    status: 'success',
    result: investors.length,
    data: {
      investors,
    },
  });
});

// get investor based on id
export const getInvestor = errorHandler(async (req, res, next) => {
  const investor = await Investor.findById(req.params.id);
  if (!investor)
    return next(
      new AppError(`there in no investor with that id (${req.params.id})`, 404)
    );
  res.status(200).json({
    status: 'success',
    data: {
      investor,
    },
  });
});

// update investor based on id
export const updateInvestor = errorHandler(async (req, res, next) => {
  const investor = await Investor.findOne({ _id: req.params.id });
  if (!investor)
    return next(
      new AppError(`there is no investor with that id (${req.params.id})`)
    );
  const updatedInvestor = await Investor.findByIdAndUpdate(
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
      updatedInvestor,
    },
  });
});

// delete investor based on id
export const deleteInvestor = errorHandler(async (req, res, next) => {
  const investor = await Investor.findById(req.params.id);
  if (!investor)
    return next(
      new AppError(`there is no investor with that id (${req.params.id})`)
    );
  await Investor.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
// get top three investors based on their points
export const getTopInvestors = errorHandler(async (req, res, next) => {
  const topInvestors = await Investor.aggregate([
    {
      $sort: { points: -1 },
    },
    {
      $project: {
        fullArabicName: 1,
        profilePhoto: 1,
        jobTitle: 1,
        points: 1,
        _id: 0,
      },
    },
    {
      $limit: 3,
    },
  ]);
  res.status(200).json({
    status: 'success',
    topInvestors,
  });
});

// get all investors invested in specific company
export const getAllInvestorsInvestedInCompany = errorHandler(
  async (req, res, next) => {
    const { companyId } = req.query;

    if (!companyId) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'companyId is required' });
    }

    const deals = await Deal.find({ companyId, status: 'Approved' }).populate(
      'investorId'
    );
    console.log(deals);

    const investors = deals.map((deal) => deal.investorId);

    res.status(200).json({
      status: 'success',
      investors,
    });
  }
);

export const saveProfile = async (req, res, next) => {
  const { profileId, profileType } = req.body;

  console.log(profileId, profileType);

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

  const investorId = req.user._id;

  const investor = await Investor.findById(investorId);

  if (!investor) {
    return next(new AppError('investor is not found', 404));
  }

  // Check if already saved
  const alreadySaved = investor.savedProfiles.some(
    (profile) =>
      profile.profileId.toString() === profileId &&
      profile.profileType === profileType
  );

  if (alreadySaved) {
    return next(new AppError('Profile already saved', 400));
  }

  // Save the profile
  await Investor.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        savedProfiles: { profileId, profileType },
      },
    },
    {
      runValidators: false,
    }
  );

  const updatedInvestor = await Investor.findById(req.user._id).select(
    'savedProfiles'
  );

  res.status(200).json({
    status: 'success',
    message: 'Profile saved successfully',
    savedProfiles: updatedInvestor.savedProfiles,
  });
};
export const getAllSavedProfiles = async (req, res, next) => {
  console.log(req.user._id);

  const investor = await Investor.findById(req.user._id).populate({
    path: 'savedProfiles.profileId',
  });

  if (!investor) {
    return next(new AppError('investor is not found', 404));
  }

  res.status(200).json({
    status: 'success',
    count: investor.savedProfiles.length,
    data: { savedProfiles: investor.savedProfiles },
  });
};

export const getAllNotifications = errorHandler(async (req, res, next) => {
  const investorId = req.user.id;

  const [respondedOutgoingOffers, consultations] = await Promise.all([
    Offer.find({
      sender: investorId,
      senderModel: 'Investor',
      companyResponded: true,
    }),
    requestConsultation.find({
      investor: investorId,
      investorReply: { $ne: '' },
    }),
  ]);

  const hasUnseenOutgoing = respondedOutgoingOffers.some(
    (offer) => offer.responseSeenBySender === false 
  );
  const hasUnseenConsultations = consultations.some(
    (cons) => cons.consultaionState === false
  );

  const allSeen =
    !hasUnseenOutgoing && !hasUnseenConsultations;

  const allNotifications = [...respondedOutgoingOffers, ...consultations];

  return res.status(200).json({
    status: 'success',
    allSeen,
    allData: allNotifications,
  });
});
