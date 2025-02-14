import { Router } from 'express';

import * as middlewares from '../../middlewares/index.js';
import {
  addOrganization,
  deleteOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
} from './organization.controller.js';
import { multerHost } from '../../middlewares/multer.middleware.js';
import { extensions } from '../../Utils/index.js';
const { auth } = middlewares;

const { errorHandler } = middlewares;

export const organizationRouter = Router();

organizationRouter.post(
  '/add',
  multerHost({ allowedExtensions: extensions.Images }).single('logoImage'),
  auth(),
  errorHandler(addOrganization)
);

organizationRouter.get('/', getAllOrganizations);
organizationRouter.get('/:organizationId', errorHandler(getOrganizationById));

organizationRouter.delete(
  '/:organizationId',
  auth(),
  errorHandler(deleteOrganization)
);

organizationRouter.put(
  '/:organizationId',
  multerHost({ allowedExtensions: extensions.Images }).single('logoImage'),
  auth(),
  errorHandler(updateOrganization)
);
