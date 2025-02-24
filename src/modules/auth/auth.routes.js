import { Router } from 'express';
import { login, forgotPassword, resetPassword } from './authController.js';

export const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/forgotPassword', forgotPassword);
authRouter.patch('/resetPassword/:token', resetPassword);
