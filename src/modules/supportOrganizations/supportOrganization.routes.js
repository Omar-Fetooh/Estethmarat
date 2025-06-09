import { Router } from 'express';
import * as middlewares from '../../middlewares/index.js';
import {
  addSupportOrganization,
  deleteSupportOrganization,
  getAllSavedProfiles,
  getAllSupportOrganizations,
  getSupportOrganizationById,
  saveProfile,
  updateSupportOrganization,
} from './supportOrganization.controller.js';
import { multerHost } from '../../middlewares/multer.middleware.js';
import { extensions } from '../../Utils/index.js';
import { protect } from '../auth/authController.js';

const { errorHandler } = middlewares;

export const supportOrganizationRouter = Router();

supportOrganizationRouter.post(
  '/register',
  multerHost({ allowedExtensions: extensions.Images }).single('image'),
  errorHandler(addSupportOrganization)
);

supportOrganizationRouter.get('/', errorHandler(getAllSupportOrganizations));
supportOrganizationRouter.get(
  '/save-profile',
  protect,
  errorHandler(getAllSavedProfiles)
);

supportOrganizationRouter.get(
  '/:organizationId',
  errorHandler(getSupportOrganizationById)
);

supportOrganizationRouter.delete(
  '/:organizationId',
  errorHandler(deleteSupportOrganization)
);

supportOrganizationRouter.put(
  '/:organizationId',
  multerHost({ allowedExtensions: extensions.Images }).single('logoImage'),
  errorHandler(updateSupportOrganization)
);

supportOrganizationRouter.post(
  '/save-profile',
  protect,
  errorHandler(saveProfile)
);
