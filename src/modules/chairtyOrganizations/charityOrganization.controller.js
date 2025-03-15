import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { cloudinaryConfig } from '../../Utils/index.js';
import { CharityOrganization } from '../../../DB/models/index.js';
import { AppError } from '../../Utils/AppError.js';
import { APIFEATURES } from '../../Utils/index.js';

export const addCharityOrganization = async (req, res, next) => {
  const {
    name,
    username,
    email,
    password,
    rePassword,
    website,
    organizationType,
    phoneNumber,
    projectTypes,
    targetedGroups,
    targetedRegions,
    supportTypes,
    commercialRegistrationNumber,
    taxIdNumber,
    representativeName,
    representativeEmail,
    representativeNationalId,
    country,
    headQuarter,
    acceptNotifications,
  } = req.body;

  if (!req.files) {
    return next(
      new AppError('Please upload an image and a pdf for document proof', 400)
    );
  }

  if (
    !email ||
    !password ||
    !rePassword ||
    !name ||
    !organizationType ||
    !phoneNumber ||
    !commercialRegistrationNumber ||
    !taxIdNumber ||
    !representativeName ||
    !representativeEmail ||
    !representativeNationalId
    // !registrationProof
  ) {
    return next(new AppError('All required fields must be provided.', 400));
  }

  if (password !== rePassword)
    return next(new AppError("password and rePassword doesn't match", 400));

  const organizationExists = await CharityOrganization.findOne({ username });
  if (organizationExists) {
    return next(new AppError('This username already exists', 400));
  }

  const customId = nanoid(4);
  const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
    req.files.image[0].path,
    {
      folder: `${process.env.UPLOADS_FOLDER}/CharityOrganization/${customId}`,
    }
  );

  const { secure_url: file_secure_url, public_id: file_public_id } =
    await cloudinaryConfig().uploader.upload(req.files.doc[0].path, {
      folder: `${process.env.UPLOADS_FOLDER}/CharityOrganization/${customId}`,
      resource_type: 'raw',
    });

  const newCharityOrganization = new CharityOrganization({
    name,
    username,
    email,
    password,
    organizationType: organizationType,
    phoneNumber,
    image: {
      secure_url,
      public_id,
    },
    registrationProof: {
      secure_url: file_secure_url,
      public_id: file_public_id,
    },
    customId,
    country,
    headQuarter,
    website,
    projectTypes: JSON.parse(projectTypes),
    targetedGroups: JSON.parse(targetedGroups),
    targetedRegions: JSON.parse(targetedRegions),
    supportTypes: JSON.parse(supportTypes),
    commercialRegistrationNumber,
    taxIdNumber,
    representativeName,
    representativeEmail,
    representativeNationalId,
    acceptNotifications,
  });

  await newCharityOrganization.save();

  res.status(201).json({
    message: 'Charity Organization Added Successfully',
    newCharityOrganization,
  });
};

export const getAllCharityOrganizations = async (req, res, next) => {
  const obj = new APIFEATURES(req.query, CharityOrganization.find())
    .filter()
    .selectFields()
    .sortFields()
    .paginate();

  const charityOrganizations = await obj.query;

  res.status(200).json({
    message: 'All charity organizations fetched successfully',
    charityOrganizations,
  });
};

export const getCharityOrganizationById = async (req, res, next) => {
  const { organizationId } = req.params;

  const organization = await CharityOrganization.findById(organizationId);

  if (!organization) {
    return next(new AppError('Sorry, organization not found', 404));
  }

  res
    .status(200)
    .json({ message: 'Organization fetched successfully', organization });
};

export const deleteCharityOrganization = async (req, res, next) => {
  const { organizationId } = req.params;

  const charityOrganization = await CharityOrganization.findById(
    organizationId
  );

  if (!charityOrganization) {
    return next(new AppError('Sorry, charity organization not found', 404));
  }

  await cloudinaryConfig().api.delete_resources_by_prefix(
    `${process.env.UPLOADS_FOLDER}/CharityOrganization/${charityOrganization.customId}`
  );

  await cloudinaryConfig().api.delete_folder(
    `${process.env.UPLOADS_FOLDER}/CharityOrganization/${charityOrganization.customId}`
  );

  charityOrganization.isMarkedAsDeleted = true;

  await charityOrganization.save();

  res.status(200).json({
    status: 'Success',
    message: 'Charity organization deleted successfully',
    data: charityOrganization,
  });
};

export const updateCharityOrganization = async (req, res, next) => {
  const { organizationId } = req.params;

  const charityOrganization = await CharityOrganization.findById(
    organizationId
  );

  if (!charityOrganization) {
    return next(new AppError('Sorry, charity organization not found', 404));
  }

  const {
    name,
    email,
    website,
    organizationType,
    phoneNumber,
    description,
    country,
    headQuarter,
    bankAccountNumber,
    sector,
    registrationNumber,
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
    fundResources,
    targetedGroups,
    targetedRegions,
    // registrationProof,
    acceptNotifications,
  } = req.body;

  if (name) {
    const isNameDuplicated = await CharityOrganization.findOne({ name });
    if (isNameDuplicated) {
      return next(new AppError('Sorry, the new name is duplicated', 400));
    }

    charityOrganization.name = name;
  }

  if (email) charityOrganization.email = email;
  if (website) charityOrganization.website = website;
  if (organizationType) charityOrganization.organizationType = organizationType;
  if (phoneNumber) charityOrganization.phoneNumber = phoneNumber;
  if (description) charityOrganization.description = description;
  if (country) charityOrganization.country = country;
  if (headQuarter) charityOrganization.headQuarter = headQuarter;
  if (bankAccountNumber)
    charityOrganization.bankAccountNumber = bankAccountNumber;
  if (sector) charityOrganization.sector = sector;
  if (registrationNumber)
    charityOrganization.registrationNumber = registrationNumber;
  if (targetFundingValue)
    charityOrganization.targetFundingValue = targetFundingValue;
  if (supportedProjectFields)
    charityOrganization.supportedProjectFields = supportedProjectFields;
  if (supportTypes) charityOrganization.supportTypes = supportTypes;
  if (targetedProjectStages)
    charityOrganization.targetedProjectStages = targetedProjectStages;
  if (providedPrograms) charityOrganization.providedPrograms = providedPrograms;
  if (commercialRegistrationNumber)
    charityOrganization.commercialRegistrationNumber =
      commercialRegistrationNumber;
  if (taxIdNumber) charityOrganization.taxIdNumber = taxIdNumber;
  if (representativeName)
    charityOrganization.representativeName = representativeName;
  if (representativeEmail)
    charityOrganization.representativeEmail = representativeEmail;
  if (representativeNationalId)
    charityOrganization.representativeNationalId = representativeNationalId;
  if (fundResources) charityOrganization.fundResources = fundResources;
  if (targetedGroups) charityOrganization.targetedGroups = targetedGroups;
  if (targetedRegions) charityOrganization.targetedRegions = targetedRegions;
  if (acceptNotifications)
    charityOrganization.acceptNotifications = acceptNotifications;

  // if (req.files) {  // TODO need to be handled again with the updates
  //   if (charityOrganization.image?.public_id) {
  //     await cloudinaryConfig().uploader.destroy(
  //       charityOrganization.image.public_id
  //     );
  //   }

  //   const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
  //     req.file.path,
  //     {
  //       folder: `${process.env.UPLOADS_FOLDER}/CharityOrganization/${charityOrganization.customId}`,
  //     }
  //   );

  //   charityOrganization.image = { secure_url, public_id };
  // }

  // if (registrationProof) {
  //   if (charityOrganization.registrationProof?.public_id) {
  //     await cloudinaryConfig().uploader.destroy(
  //       charityOrganization.registrationProof.public_id
  //     );
  //   }

  //   const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
  //     registrationProof.path,
  //     {
  //       folder: `${process.env.UPLOADS_FOLDER}/CharityOrganization/${charityOrganization.customId}/RegistrationProof`,
  //     }
  //   );

  //   charityOrganization.registrationProof = { secure_url, public_id };
  // }

  await charityOrganization.save();

  res.status(200).json({
    message: 'Charity organization updated successfully',
    charityOrganization,
  });
};
