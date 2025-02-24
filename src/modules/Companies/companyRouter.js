import { Router } from 'express';

export const companyRouter = Router();

import {
  createCompany,
  deleteCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
} from './companyController.js';

companyRouter.route('/').get(getAllCompanies);
companyRouter.route('/register').post(createCompany);
companyRouter
  .route('/:id')
  .get(getCompany)
  .patch(updateCompany)
  .delete(deleteCompany);
