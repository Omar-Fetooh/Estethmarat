import slugify from 'slugify';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
// import { cloudinaryConfig } from '../../Utils/index.js';
import { Organization } from '../../../DB/models/index.js';
import { AppError } from '../../Utils/AppError.js';
import { APIFEATURES } from '../../Utils/index.js';

export const addOrganization = async (req, res, next) => {
  const {
    name,
    email,
    password,
    websiteUrl,
    typeOfOrganization,
    phoneNumber,
    description,
    location,
    bankAccountNumber,
    sector,
    registerationNumber,
    budget,
    fields,
    legalRepresentativeId,
  } = req.body;

  const slug = slugify(name, { replacement: '_', lower: 'true' });

  if (!req.file) {
    return next(new AppError('please upload a Logo Image', 400));
  }

  if (
    !email ||
    !password ||
    !name ||
    !typeOfOrganization ||
    !phoneNumber ||
    !description ||
    !location
  ) {
    return next(new AppError('All Required fields must be provided.', 400));
  }

  const organizationExists = await Organization.findOne({ name });
  if (organizationExists)
    return next(new AppError('This name already exists', 400));

  const customId = nanoid(4);
  const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
    req.file.path,
    {
      folder: `${process.env.UPLOADS_FOLDER}/Organization/${customId}`,
    }
  );

  const newOrganization = new Organization({
    name,
    slug,
    email,
    password,
    typeOfOrganization,
    phoneNumber,
    description,
    logoImage: {
      secure_url,
      public_id,
    },
    location,
    customId,
    websiteUrl,
    bankAccountNumber,
    sector,
    registerationNumber,
    budget,
    fields,
    legalRepresentativeId,
  });

  await newOrganization.save();

  res
    .status(201)
    .json({ message: 'Organization Added Successfully', newOrganization });
};

export const getAllOrganizations = async (req, res, next) => {
  const obj = new APIFEATURES(req.query, Organization.find())
    .filter()
    .selectFields()
    .sortFields()
    .paginate();

  const organizations = await obj.query;

  res
    .status(200)
    .json({ message: 'All organizations fetched successfully', organizations });
};

export const getOrganizationById = async (req, res, next) => {
  const { organizationId } = req.params;

  const organization = await Organization.findById(organizationId);

  if (!organization) {
    return next(new AppError('Sorry organization not found', 404));
  }

  res
    .status(200)
    .json({ message: 'organization fetched successfully', organization });
};

export const deleteOrganization = async (req, res, next) => {
  const { organizationId } = req.params;

  const organization = await Organization.findById(organizationId);

  if (!organization) {
    return next(new AppError('Sorry organization not found', 404));
  }

  await cloudinaryConfig().api.delete_resources_by_prefix(
    `${process.env.UPLOADS_FOLDER}/Organization/${organization.customId}`
  );

  await cloudinaryConfig().api.delete_folder(
    `${process.env.UPLOADS_FOLDER}/Organization/${organization.customId}`
  );

  // only soft delete
  organization.isMarkedAsDeleted = true;

  await organization.save();

  res.status(200).json({
    status: 'Success',
    message: 'Organization deleted successfully',
    data: organization,
  });
};

export const updateOrganization = async (req, res, next) => {
  const { organizationId } = req.params;

  const organization = await Organization.findById(organizationId);

  if (!organization) {
    return next(new AppError('Sorry organization not found', 404));
  }
  const {
    name,
    email,
    // password,   // TODO should make it a special  end point for reset password and all that stuff
    websiteUrl,
    typeOfOrganization,
    phoneNumber,
    description,
    location,
    bankAccountNumber,
    sector,
    registerationNumber,
    budget,
    fields,
    legalRepresentativeId,
  } = req.body;

  if (name) {
    const isNameDuplicated = await Organization.findOne({ name });
    if (isNameDuplicated) {
      return next(new AppError('sorry the new name is duplicated', 400));
    }

    const slug = slugify(name, { replacement: '_', lower: true });
    organization.name = name;
    organization.slug = slug;
  }

  if (email) organization.email = email;
  if (websiteUrl) organization.websiteUrl = websiteUrl;
  if (typeOfOrganization) organization.typeOfOrganization = typeOfOrganization;
  if (phoneNumber) organization.phoneNumber = phoneNumber;
  if (description) organization.description = description;
  if (location) organization.location = location;
  if (bankAccountNumber) organization.bankAccountNumber = bankAccountNumber;
  if (sector) organization.sector = sector;
  if (registerationNumber)
    organization.registerationNumber = registerationNumber;
  if (budget) organization.budget = budget;
  if (fields) organization.fields = fields;
  if (legalRepresentativeId)
    organization.legalRepresentativeId = legalRepresentativeId;

  if (req.file) {
    // Delete the old logo from Cloudinary
    if (organization.logoImage?.public_id) {
      await cloudinaryConfig().uploader.destroy(
        organization.logoImage.public_id
      );
    }

    // Upload the new logo to Cloudinary
    const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
      req.file.path,
      {
        folder: `${process.env.UPLOADS_FOLDER}/Organization/${organization.customId}`,
      }
    );

    // Update the logo image in the organization document
    organization.logoImage = { secure_url, public_id };
  }

  await organization.save();

  res.status(200).json({
    message: 'Organization updated successfully',
    organization,
  });
};
