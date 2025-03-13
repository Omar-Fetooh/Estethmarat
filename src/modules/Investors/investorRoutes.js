// import { Router } from 'express';
// import {
//   login,
//   forgotPassword,
//   resetPassword,
//   logout,
// } from '../auth/authController.js';
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
} from './investorController.js';

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
investorRouter.route('/register').post(register);
investorRouter.route('/').get(getAllInvestors);

investorRouter
  .route('/:id')
  .get(getInvestor)
  .patch(updateInvestor)
  .delete(deleteInvestor);
