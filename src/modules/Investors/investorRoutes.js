import { Router } from 'express';
// import {
//   login,
//   forgotPassword,
//   resetPassword,
//   logout,
//   protect,
// } from './../auth/authController.js';
export const investorRouter = Router();

import {
  register,
  getAllInvestors,
  getInvestor,
  updateInvestor,
  deleteInvestor,
  getTopInvestors,
} from './investorController.js';

import { uploadPhoto, resizePhoto } from '../upload.js';

// investorRouter.post('/login', login);
// investorRouter.get('/logout', logout);
// investorRouter.post('/forgotPassword', forgotPassword);
// investorRouter.patch('/resetPassword/:token', resetPassword);
// investorRouter.route('/register').post(register);
// investorRouter.route('/').get(getAllInvestors);
// investorRouter.get('/logout', logout);
// investorRouter.post('/forgotPassword', forgotPassword);
// investorRouter.patch('/resetPassword/:token', resetPassword);
// get three top investors with maxium points
investorRouter.get('/top-investors', getTopInvestors);
investorRouter.route('/').get(getAllInvestors);
investorRouter.route('/register').post(uploadPhoto, resizePhoto, register);

investorRouter
  .route('/:id')
  .get(getInvestor)
  .patch(updateInvestor)
  .delete(deleteInvestor);
