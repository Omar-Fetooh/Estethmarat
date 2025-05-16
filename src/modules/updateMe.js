import { Router } from 'express';
import multer from 'multer';
export const updateMeRouter = Router();
import { Investor } from '../../DB/models/investor.model.js';
import { Company } from '../../DB/models/company.model.js';
import { CharityOrganization } from '../../DB/models/charityOrganization.model.js';
import { supportOrganization } from '../../DB/models/supportOrganization.model.js';
import { protect } from './auth/authController.js';
import { AppError } from '../Utils/AppError.js';
import { errorHandler } from './../middlewares/error-handling.middleware.js';
import { charityOrganizationRouter } from './chairtyOrganizations/charityOrganization.routes.js';
import { uploadingCharityOrganizationFiles } from './chairtyOrganizations/charityOrganization.controller.js';
import { multerHost } from '../middlewares/multer.middleware.js';
import { extensions } from '../Utils/index.js';
import { uploadingSupportOrganization } from './supportOrganizations/supportOrganization.controller.js';
import {
  uploadCompanyPhoto,
  uploadInvestorPhoto,
  imageProcessing,
} from './upload.js';
const conditionalUploading = (req, res, next) => {
  if (req.user.role === 'company') {
    return uploadCompanyPhoto(req, res, next);
  } else if (req.user.role === 'investor') {
    return uploadInvestorPhoto(req, res, next);
  } else if (req.user.role === 'charityOrganization') {
    const upload = multerHost({
      allowedExtensions: [...extensions.Images, ...extensions.Documents],
    }).fields([
      { name: 'image', maxCount: 1 },
      { name: 'registrationProof', maxCount: 1 },
    ]);

    upload(req, res, function () {
      return uploadingCharityOrganizationFiles(req, res, next);
    });
  } else if (req.user.role === 'supportOrganization') {
    const upload = multerHost({ allowedExtensions: extensions.Images }).single(
      'image'
    );
    upload(req, res, function () {
      return uploadingSupportOrganization(req, res, next);
    });
  }
};
updateMeRouter.patch(
  '/',
  protect,
  conditionalUploading,
  imageProcessing,
  errorHandler(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError('This route is not for password updates. Please use', 400)
      );
    }
    console.log(req.body);
    let updatedUser;
    if (req.body.role === 'investor') {
      updatedUser = await Investor.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
        runValidators: true,
      });
    }
    if (req.body.role === 'company') {
      updatedUser = await Company.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
        runValidators: true,
      });
    }
    if (req.body.role === 'charityOrganization') {
      updatedUser = await CharityOrganization.findByIdAndUpdate(
        req.user._id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    }
    if (req.body.role === 'supportOrganization') {
      updatedUser = await supportOrganization.findByIdAndUpdate(
        req.user._id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    }
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  })
);
