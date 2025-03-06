import { Router } from 'express';
<<<<<<< HEAD
import { forgotPassword, login, resetPassword } from './authController-omar.js';
// import {
//   forgotPassword,
//   login,
//   logout,
//   resetPassword,
// } from './authController.js';
=======
import { login, forgotPassword, resetPassword } from './authController.js';
>>>>>>> 47367c249b182e72b7d48976f3fe8714f75a2007

export const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/forgotPassword', forgotPassword);
<<<<<<< HEAD
authRouter.patch('/resetPassword', resetPassword);
// authRouter.get('/logout', logout);
=======
authRouter.patch('/resetPassword/:token', resetPassword);
>>>>>>> 47367c249b182e72b7d48976f3fe8714f75a2007
