import { Router } from 'express';
import * as middlewares from '../../middlewares/index.js';
import {
  addSupportOrganization,
  deleteSupportOrganization,
  getAllSupportOrganizations,
  getSupportOrganizationById,
  updateSupportOrganization,
} from './supportOrganization.controller.js';
import { multerHost } from '../../middlewares/multer.middleware.js';
import { extensions } from '../../Utils/index.js';

const { errorHandler } = middlewares;

export const supportOrganizationRouter = Router();

supportOrganizationRouter.post(
  '/add',
  multerHost({ allowedExtensions: extensions.Images }).single('image'),
  errorHandler(addSupportOrganization)
);

supportOrganizationRouter.get('/', errorHandler(getAllSupportOrganizations));
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
