import { Router } from 'express';
import {
  login,
  forgotPassword,
  resetPassword,
  logout,
} from './../authController.js';

import {
  register,
  getAllInvestors,
  getInvestor,
  updateInvestor,
  deleteInvestor,
} from './investorController.js';

export const investorRouter = Router();

investorRouter.post('/login', login);
investorRouter.get('/logout', logout);
investorRouter.post('/forgotPassword', forgotPassword);
investorRouter.patch('/resetPassword/:token', resetPassword);
investorRouter.route('/register').post(register);
investorRouter.route('/').get(getAllInvestors);

investorRouter
  .route('/:id')
  .get(getInvestor)
  .patch(updateInvestor)
  .delete(deleteInvestor);
