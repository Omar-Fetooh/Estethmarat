import { Router } from 'express';

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
companyRouter.route('/register').post(createCompany);
companyRouter
  .route('/:id')
  .get(getCompany)
  .patch(updateCompany)
  .delete(deleteCompany);
