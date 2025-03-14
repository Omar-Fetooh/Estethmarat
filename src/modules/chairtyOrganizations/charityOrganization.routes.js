import { Router } from 'express';
import * as middlewares from '../../middlewares/index.js';
import {
  addCharityOrganization,
  deleteCharityOrganization,
  getAllCharityOrganizations,
  getCharityOrganizationById,
  updateCharityOrganization,
} from './charityOrganization.controller.js';
import { multerHost } from '../../middlewares/multer.middleware.js';
import { extensions } from '../../Utils/index.js';

const { errorHandler } = middlewares;

export const charityOrganizationRouter = Router();

charityOrganizationRouter.post(
  '/add',
  multerHost({
    allowedExtensions: [...extensions.Images, ...extensions.Documents],
  }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'doc', maxCount: 1 },
  ]),
  errorHandler(addCharityOrganization)
);

charityOrganizationRouter.get('/', errorHandler(getAllCharityOrganizations));
charityOrganizationRouter.get(
  '/:organizationId',
  errorHandler(getCharityOrganizationById)
);

charityOrganizationRouter.delete(
  '/:organizationId',
  errorHandler(deleteCharityOrganization)
);

charityOrganizationRouter.put(
  '/:organizationId',
  multerHost({
    allowedExtensions: [...extensions.Images, extensions.Documents],
  }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'doc', maxCount: 1 },
  ]),
  errorHandler(updateCharityOrganization)
);
