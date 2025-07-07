import { Router } from 'express';
import { setAdmin } from './admin.controller.js';
export const adminRouter = Router();
adminRouter.post('/', setAdmin);
