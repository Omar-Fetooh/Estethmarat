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
<<<<<<< HEAD
=======
const { auth } = middlewares;
>>>>>>> d3ab37cc40e8c36d25a63082081b1b79db42ebe9

const { errorHandler } = middlewares;

export const organizationRouter = Router();

organizationRouter.post(
  '/add',
  multerHost({ allowedExtensions: extensions.Images }).single('logoImage'),
<<<<<<< HEAD
=======
  // auth(),
>>>>>>> d3ab37cc40e8c36d25a63082081b1b79db42ebe9
  errorHandler(addOrganization)
);

organizationRouter.get('/', getAllOrganizations);
organizationRouter.get('/:organizationId', errorHandler(getOrganizationById));

<<<<<<< HEAD
organizationRouter.delete('/:organizationId', errorHandler(deleteOrganization));
=======
organizationRouter.delete(
  '/:organizationId',
  auth(),
  errorHandler(deleteOrganization)
);
>>>>>>> d3ab37cc40e8c36d25a63082081b1b79db42ebe9

organizationRouter.put(
  '/:organizationId',
  multerHost({ allowedExtensions: extensions.Images }).single('logoImage'),
<<<<<<< HEAD
=======
  auth(),
>>>>>>> d3ab37cc40e8c36d25a63082081b1b79db42ebe9
  errorHandler(updateOrganization)
);
