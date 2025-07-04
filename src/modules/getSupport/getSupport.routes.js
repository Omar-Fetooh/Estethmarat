import { Router } from 'express';
import { createGettingSupport } from './getSupportController.js';
import { upload } from '../auth/authController.js';

export const getSupportRouter = Router();

getSupportRouter.post('/:postId', upload.none(), createGettingSupport);
