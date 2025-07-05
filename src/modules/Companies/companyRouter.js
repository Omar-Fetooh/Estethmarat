import { Router } from 'express';
import { uploadCompanyPhoto, imageProcessing } from '../upload.js';
export const companyRouter = Router();

import {
  createCompany,
  deleteCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  getTopCompanies,
  getAllSavedProfiles,
  saveProfile,
  protect,
} from './companyController.js';
import { protect } from '../auth/authController.js';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';
//get top five companies with maximum netProfit
companyRouter.get('/top-companies', getTopCompanies);
companyRouter.route('/').get(getAllCompanies);

companyRouter.get('/save-profile', protect, errorHandler(getAllSavedProfiles));
companyRouter.post('/save-profile', protect, errorHandler(saveProfile));

companyRouter.post(
  '/register',
  uploadCompanyPhoto,
  imageProcessing,
  createCompany
);
companyRouter
  .route('/:id')
  .get(getCompany)
  .patch(updateCompany)
  .delete(protect, deleteCompany);
