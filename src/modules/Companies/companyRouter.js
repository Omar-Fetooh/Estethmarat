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
import { Company } from '../../../DB/models/company.model.js';
// get five companies with net profit
companyRouter.get('/top-companies', getTopCompanies);
companyRouter.route('/').get(protect, getAllCompanies);
companyRouter.route('/register').post(createCompany);
companyRouter
  .route('/:id')
  .get(getCompany)
  .patch(updateCompany)
  .delete(deleteCompany);
