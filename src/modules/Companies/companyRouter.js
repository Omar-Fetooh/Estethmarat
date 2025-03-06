import { Router } from 'express';

export const companyRouter = Router();

import {
  createCompany,
  deleteCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
} from './companyController.js';
import { protect } from '../auth/authController.js';
companyRouter.route('/').get(protect, getAllCompanies);
companyRouter.route('/register').post(createCompany);
companyRouter
  .route('/:id')
  .get(getCompany)
  .patch(updateCompany)
  .delete(deleteCompany);
