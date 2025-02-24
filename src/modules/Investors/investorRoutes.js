<<<<<<< HEAD
// import { Router } from 'express';
// import {
//   login,
//   forgotPassword,
//   resetPassword,
//   logout,
// } from '../auth/authController.js';
=======
import { Router } from 'express';
import {
  login,
  forgotPassword,
  resetPassword,
  logout,
  protect,
} from './../auth/authController.js';
>>>>>>> 47367c249b182e72b7d48976f3fe8714f75a2007

// import {
//   register,
//   getAllInvestors,
//   getInvestor,
//   updateInvestor,
//   deleteInvestor,
// } from './investorController.js';

// export const investorRouter = Router();

// investorRouter.post('/login', login);
<<<<<<< HEAD
// investorRouter.get('/logout', logout);
// investorRouter.post('/forgotPassword', forgotPassword);
// investorRouter.patch('/resetPassword/:token', resetPassword);
// investorRouter.route('/register').post(register);
// investorRouter.route('/').get(getAllInvestors);
=======
investorRouter.get('/logout', logout);
// investorRouter.post('/forgotPassword', forgotPassword);
// investorRouter.patch('/resetPassword/:token', resetPassword);
investorRouter.route('/register').post(register);
investorRouter.route('/').get(getAllInvestors);
>>>>>>> 47367c249b182e72b7d48976f3fe8714f75a2007

// investorRouter
//   .route('/:id')
//   .get(getInvestor)
//   .patch(updateInvestor)
//   .delete(deleteInvestor);
