import { Router } from 'express';
// import {
//   login,
//   forgotPassword,
//   resetPassword,
//   logout,
//   protect,
// } from './../auth/authController.js';

import {
  register,
  getAllInvestors,
  getInvestor,
  updateInvestor,
  deleteInvestor,
  getTopInvestors,
  getAllInvestorsInvestedInCompany,
  saveProfile,
  getAllSavedProfiles,
  protect,
} from './investorController.js';
import { uploadInvestorPhoto, imageProcessing } from '../upload.js';
import { protect } from '../auth/authController.js';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';
export const investorRouter = Router();

// investorRouter.post('/login', login);
// investorRouter.get('/logout', logout);
// investorRouter.post('/forgotPassword', forgotPassword);
// investorRouter.patch('/resetPassword/:token', resetPassword);
// investorRouter.route('/register').post(register);
// investorRouter.route('/').get(getAllInvestors);
// investorRouter.get('/logout', logout);
// investorRouter.post('/forgotPassword', forgotPassword);
// investorRouter.patch('/resetPassword/:token', resetPassword);
// get the three top investors with maximum points
investorRouter.get('/top-investors', getTopInvestors);
investorRouter.get('/save-profile', protect, errorHandler(getAllSavedProfiles));
investorRouter.post('/save-profile', protect, errorHandler(saveProfile));

investorRouter.post(
  '/register',
  uploadInvestorPhoto,
  imageProcessing,
  register
);
investorRouter.route('/').get(getAllInvestors);
investorRouter.get('/invested', getAllInvestorsInvestedInCompany);

investorRouter
  .route('/:id')
  .get(getInvestor)
  .patch(updateInvestor)
  .delete(protect, deleteInvestor);
