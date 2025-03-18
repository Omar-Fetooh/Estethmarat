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
} from './companyController.js';
import { protect } from '../auth/authController.js';
//get top five companies with maximum netProfit
companyRouter.get('/top-companies', getTopCompanies);
companyRouter.route('/').get(protect, getAllCompanies);
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
  .delete(deleteCompany);
