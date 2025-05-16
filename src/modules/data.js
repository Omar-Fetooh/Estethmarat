import { Router } from 'express';
import { errorHandler } from './../middlewares/error-handling.middleware.js';
import { Investor } from '../../DB/models/investor.model.js';
import { Company } from '../../DB/models/company.model.js';
import { CharityOrganization } from '../../DB/models/charityOrganization.model.js';
import { supportOrganization } from '../../DB/models/supportOrganization.model.js';
import { protect } from './auth/authController.js';
import { AppError } from '../Utils/AppError.js';
export const dataRouter = Router();
dataRouter.get(
  '/',
  protect,
  errorHandler(async (req, res, next) => {
    const { userId } = req.query;
    let user;
    const company = await Company.findById(userId);
    const investor = await Investor.findById(userId);
    const charityOrganization = await CharityOrganization.findById(userId);
    const supportOrg = await supportOrganization.findById(userId);
    if (company) user = company;
    if (investor) user = investor;
    if (charityOrganization) user = charityOrganization;
    if (supportOrg) user = supportOrg;
    if (!user) return next(new AppError('User not found with this id', 404));

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  })
);
