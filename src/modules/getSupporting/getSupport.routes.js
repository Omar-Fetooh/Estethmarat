import { Router } from 'express';
import { upload } from '../consultationReplies/consultationReplies.controller.js';
export const getSupportRouter = Router();
import { createSupporting } from './getSupport.controller.js';
getSupportRouter.post('/:postId', upload.none(), createSupporting);
