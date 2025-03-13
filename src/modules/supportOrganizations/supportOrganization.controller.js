import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { cloudinaryConfig } from '../../Utils/index.js';
import { SupportOrganization } from '../../../DB/models/index.js';
import { AppError } from '../../Utils/AppError.js';
import { APIFEATURES } from '../../Utils/index.js';

export const addSupportOrganization = async (req, res, next) => {
  const {
    name,
    username,
    email,
    password,
    website,
    organizationType,
    phoneNumber,
    description,
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
    country,
    headQuarter,
  } = req.body;

  if (!req.file) {
    return next(new AppError('Please upload an Image', 400));
  }

  if (
    !email ||
    !password ||
    !name ||
    !organizationType ||
    !phoneNumber ||
    !description ||
    // !location
    !country ||
    !headQuarter
  ) {
    return next(new AppError('All required fields must be provided.', 400));
  }

  const organizationExists = await SupportOrganization.findOne({ username });
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

  const newSupportOrganization = new SupportOrganization({
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
    // location,
    country,
    headQuarter,
    customId,
    website,
    bankAccountNumber,
    sector,
    registrationNumber,
    targetFundingValue,
    supportedProjectFields: JSON.parse(supportedProjectFields),
    supportTypes: JSON.parse(supportTypes),
    targetedProjectStages: JSON.parse(targetedProjectStages),
    providedPrograms: JSON.parse(providedPrograms),
    commercialRegistrationNumber,
    taxIdNumber,
    representativeName,
    representativeEmail,
    representativeNationalId,
    fundResources: JSON.parse(fundResources),
  });

  await newSupportOrganization.save();

  res.status(201).json({
    message: 'Support Organization Added Successfully',
    newSupportOrganization,
  });
};

export const getAllSupportOrganizations = async (req, res, next) => {
  const obj = new APIFEATURES(req.query, SupportOrganization.find())
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

  const organization = await SupportOrganization.findById(organizationId);

  if (!organization) {
    return next(new AppError('Sorry organization not found', 404));
  }

  res
    .status(200)
    .json({ message: 'organization fetched successfully', organization });
};

export const deleteSupportOrganization = async (req, res, next) => {
  const { organizationId } = req.params;

  const supportOrganization = await SupportOrganization.findById(
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

  const supportOrganization = await SupportOrganization.findById(
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
  } = req.body;

  if (name) {
    const isNameDuplicated = await SupportOrganization.findOne({ name });
    if (isNameDuplicated) {
      return next(new AppError('Sorry, the new name is duplicated', 400));
    }

    const slug = slugify(name, { replacement: '_', lower: true });
    supportOrganization.name = name;
    supportOrganization.slug = slug;
  }

  if (email) supportOrganization.email = email;
  if (website) supportOrganization.website = website;
  if (organizationType) supportOrganization.organizationType = organizationType;
  if (phoneNumber) supportOrganization.phoneNumber = phoneNumber;
  if (description) supportOrganization.description = description;
  // if (location) supportOrganization.location = location;
  if (country) supportOrganization.country = country;
  if (headQuarter) supportOrganization.headQuarter = headQuarter;
  if (bankAccountNumber)
    supportOrganization.bankAccountNumber = bankAccountNumber;
  if (sector) supportOrganization.sector = sector;
  if (registrationNumber)
    supportOrganization.registrationNumber = registrationNumber;
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
  if (fundResources) supportOrganization.fundResources = fundResources;

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
