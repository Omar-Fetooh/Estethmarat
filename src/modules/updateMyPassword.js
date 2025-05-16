import { Router } from 'express';
export const updateMyPasswordRouter = Router();
import { Investor } from '../../DB/models/investor.model.js';
import { Company } from '../../DB/models/company.model.js';
import { CharityOrganization } from '../../DB/models/charityOrganization.model.js';
import { supportOrganization } from '../../DB/models/supportOrganization.model.js';
import { protect } from './auth/authController.js';
import { AppError } from '../Utils/AppError.js';
import { errorHandler } from './../middlewares/error-handling.middleware.js';
import { createTokenAndSendCookie } from './auth/authController.js';
updateMyPasswordRouter.patch(
  '/',
  protect,
  errorHandler(async (req, res, next) => {
    if (!req.body.currentPassword || !req.body.passwordConfirm) {
      return next(
        new AppError('Please provide password and passwordConfirm', 400)
      );
    }

    let user, modelType;
    const investor = await Investor.findById(req.user._id).select('+password');
    const company = await Company.findById(req.user._id).select('+password');
    const charity = await CharityOrganization.findById(req.user._id).select(
      '+password'
    );
    const supportOrg = await supportOrganization
      .findById(req.user._id)
      .select('+password');
    if (investor) {
      user = investor;
      modelType = Investor;
    }
    if (company) {
      user = company;
      modelType = Company;
    }
    if (charity) {
      user = charity;
      modelType = CharityOrganization;
    }
    if (supportOrg) {
      user = supportOrg;
      modelType = supportOrganization;
    }
    if (!user) return next(new AppError('User not found with this id', 404));
    if (
      !(await user.correctPassword(req.body.currentPassword, user.password))
    ) {
      return next(new AppError('Your current password is wrong', 401));
    }

    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    const token = createTokenAndSendCookie(user._id, user.role, res);
    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
      token,
    });
  })
);
