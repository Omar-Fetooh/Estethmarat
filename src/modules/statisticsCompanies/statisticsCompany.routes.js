import { Router } from 'express';
export const TopThreeCompanyRouter = Router();
import { getTopThreeCompanies } from './statisticsCompany.controller.js';
TopThreeCompanyRouter.get('/', getTopThreeCompanies);
