import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { cloudinaryConfig } from '../../Utils/cloudinary.js';
import { supportOrganization } from '../../../DB/models/supportOrganization.model.js';
import { createTokenAndSendCookie } from '../../modules/auth/authController.js';
import { AppError } from '../../Utils/AppError.js';
import { APIFEATURES } from '../../Utils/index.js';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';
export const uploadingSupportOrganization = errorHandler(
  async (req, res, next) => {
    if (req.file != undefined) {
      const customId = nanoid(4);
      const { secure_url, public_id } =
        await cloudinaryConfig().uploader.upload(req.file.path, {
          folder: `${process.env.UPLOADS_FOLDER}/SupportOrganization/${customId}`,
        });
      req.body.image = {
        secure_url,
        public_id,
      };
    }
    next();
  }
);
export const addSupportOrganization = async (req, res, next) => {
  const {
    name,
    username,
    email,
    password,
    rePassword,
    website,
    organizationType,
    phoneNumber,
    description,
    targetFundingValue,
    supportedProjectFields,
    supportTypes,
    targetedProjectStages,
    providedPrograms,
    commercialRegistrationNumber,
    taxIdNumber,
    representativeName,
    representativeEmail,
    representativeNationalId,
    numberOfProjectsSupported,
    acceptNotifications,
    country,
    headQuarter,
  } = req.body;

  if (!req.file) {
    return next(new AppError('Please upload an Image', 400));
  }

  if (
    !email ||
    !password ||
    !rePassword ||
    !name ||
    !organizationType ||
    !phoneNumber ||
    !description ||
    !country ||
    !headQuarter
  ) {
    return next(new AppError('All required fields must be provided.', 400));
  }

  if (password !== rePassword)
    return next(new AppError("password and rePassword doesn't match", 400));

  const organizationExists = await supportOrganization.findOne({ username });
  if (organizationExists) {
    return next(new AppError('This name already exists', 400));
  }

  const customId = nanoid(4);
  const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
    req.file.path,
    {
      folder: `${process.env.UPLOADS_FOLDER}/SupportOrganization/${customId}`,
    }
  );

  const newSupportOrganization = new supportOrganization({
    name,
    username,
    email,
    password,
    organizationType: organizationType,
    phoneNumber,
    description,
    image: {
      secure_url,
      public_id,
    },
    country,
    headQuarter,
    customId,
    website,
    targetFundingValue,
    supportedProjectFields,
    supportTypes,
    targetedProjectStages,
    providedPrograms: providedPrograms,
    commercialRegistrationNumber,
    taxIdNumber,
    representativeName,
    representativeEmail,
    representativeNationalId,
    numberOfProjectsSupported,
    acceptNotifications,
  });

  const supportOrg = await newSupportOrganization.save();
  supportOrg.password = undefined;
  // create token
  const token = createTokenAndSendCookie(supportOrg.id, supportOrg.role, res);
  res.status(201).json({
    message: 'Support Organization Added Successfully',
    newSupportOrganization,
    token,
  });
};

export const getAllSupportOrganizations = async (req, res, next) => {
  const obj = new APIFEATURES(req.query, supportOrganization.find())
    .filter()
    .selectFields()
    .sortFields()
    .paginate();

  const supportOrganizations = await obj.query;

  res.status(200).json({
    message: 'All support organizations fetched successfully',
    supportOrganizations,
  });
};

export const getSupportOrganizationById = async (req, res, next) => {
  const { organizationId } = req.params;

  const organization = await supportOrganization.findById(organizationId);

  if (!organization) {
    return next(new AppError('Sorry organization not found', 404));
  }

  res
    .status(200)
    .json({ message: 'organization fetched successfully', organization });
};

export const deleteSupportOrganization = async (req, res, next) => {
  const { organizationId } = req.params;

  const supportOrganization = await supportOrganization.findById(
    organizationId
  );

  if (!supportOrganization) {
    return next(new AppError('Sorry, support organization not found', 404));
  }

  await cloudinaryConfig().api.delete_resources_by_prefix(
    `${process.env.UPLOADS_FOLDER}/SupportOrganization/${supportOrganization.customId}`
  );

  await cloudinaryConfig().api.delete_folder(
    `${process.env.UPLOADS_FOLDER}/SupportOrganization/${supportOrganization.customId}`
  );

  supportOrganization.isMarkedAsDeleted = true;

  await supportOrganization.save();

  res.status(200).json({
    status: 'Success',
    message: 'Support organization deleted successfully',
    data: supportOrganization,
  });
};

export const updateSupportOrganization = async (req, res, next) => {
  const { organizationId } = req.params;

  const supportOrganization = await supportOrganization.findById(
    organizationId
  );

  if (!supportOrganization) {
    return next(new AppError('Sorry, support organization not found', 404));
  }

  const {
    name,
    email,
    website,
    organizationType,
    phoneNumber,
    description,
    targetFundingValue,
    supportedProjectFields,
    supportTypes,
    targetedProjectStages,
    providedPrograms,
    commercialRegistrationNumber,
    taxIdNumber,
    representativeName,
    representativeEmail,
    representativeNationalId,
    numberOfProjectsSupported,
    acceptNotifications,
  } = req.body;

  if (name) {
    const isNameDuplicated = await supportOrganization.findOne({ name });
    if (isNameDuplicated) {
      return next(new AppError('Sorry, the new name is duplicated', 400));
    }

    // const slug = slugify(name, { replacement: '_', lower: true });
    supportOrganization.name = name;
    // supportOrganization.slug = slug;
  }

  if (email) supportOrganization.email = email;
  if (website) supportOrganization.website = website;
  if (organizationType) supportOrganization.organizationType = organizationType;
  if (phoneNumber) supportOrganization.phoneNumber = phoneNumber;
  if (description) supportOrganization.description = description;
  if (country) supportOrganization.country = country;
  if (headQuarter) supportOrganization.headQuarter = headQuarter;
  if (targetFundingValue)
    supportOrganization.targetFundingValue = targetFundingValue;
  if (supportedProjectFields)
    supportOrganization.supportedProjectFields = supportedProjectFields;
  if (supportTypes) supportOrganization.supportTypes = supportTypes;
  if (targetedProjectStages)
    supportOrganization.targetedProjectStages = targetedProjectStages;
  if (providedPrograms) supportOrganization.providedPrograms = providedPrograms;
  if (commercialRegistrationNumber)
    supportOrganization.commercialRegistrationNumber =
      commercialRegistrationNumber;
  if (taxIdNumber) supportOrganization.taxIdNumber = taxIdNumber;
  if (representativeName)
    supportOrganization.representativeName = representativeName;
  if (representativeEmail)
    supportOrganization.representativeEmail = representativeEmail;
  if (representativeNationalId)
    supportOrganization.representativeNationalId = representativeNationalId;

  if (numberOfProjectsSupported)
    supportOrganization.numberOfProjectsSupported = numberOfProjectsSupported;

  if (acceptNotifications)
    supportOrganization.acceptNotifications = acceptNotifications;

  if (req.file) {
    if (supportOrganization.image?.public_id) {
      await cloudinaryConfig().uploader.destroy(
        supportOrganization.image.public_id
      );
    }

    const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
      req.file.path,
      {
        folder: `${process.env.UPLOADS_FOLDER}/SupportOrganization/${supportOrganization.customId}`,
      }
    );

    supportOrganization.image = { secure_url, public_id };
  }

  await supportOrganization.save();

  res.status(200).json({
    message: 'Support organization updated successfully',
    supportOrganization,
  });
};

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

  const organizationId = req.user._id;

  const organization = await supportOrganization.findById(organizationId);

  if (!organization) {
    return next(new AppError('Organization is not found', 404));
  }

  // Check if already saved
  const alreadySaved = organization.savedProfiles.some(
    (profile) =>
      profile.profileId.toString() === profileId &&
      profile.profileType === profileType
  );

  if (alreadySaved) {
    return next(new AppError('Profile already saved', 400));
  }

  // Save the profile using $push and avoid full document validation
  await supportOrganization.findByIdAndUpdate(
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

  const updatedOrganization = await supportOrganization.findById(
    req.user._id
  ).select('savedProfiles');

  res.status(200).json({
    status: 'success',
    message: 'Profile saved successfully',
    savedProfiles: updatedOrganization.savedProfiles,
  });
};
export const getAllSavedProfiles = async (req, res, next) => {
  console.log(req.user._id);

  const organization = await supportOrganization
    .findById(req.user._id)
    .populate({
      path: 'savedProfiles.profileId',
    });

  if (!organization) {
    return next(new AppError('Organization is not found', 404));
  }

  res.status(200).json({
    status: 'success',
    count: organization.savedProfiles.length,
    data: { savedProfiles: organization.savedProfiles },
  });
};
