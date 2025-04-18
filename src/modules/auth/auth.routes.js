import { Router } from 'express';
import {
  forgotPassword,
  login,
  logout,
  resetPassword,
  upload,
} from './authController.js';

export const authRouter = Router();

authRouter.post('/login', upload.none(), login);
authRouter.post('/forgotPassword', upload.none(), forgotPassword);
authRouter.patch('/resetPassword', resetPassword);
authRouter.get('/logout', logout);
