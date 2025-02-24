import { Router } from 'express';
import { forgotPassword, login, resetPassword } from './authController-omar.js';
// import {
//   forgotPassword,
//   login,
//   logout,
//   resetPassword,
// } from './authController.js';

export const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/forgotPassword', forgotPassword);
authRouter.patch('/resetPassword', resetPassword);
// authRouter.get('/logout', logout);
