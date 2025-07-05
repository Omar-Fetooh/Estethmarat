import { Router } from 'express';
import multer from 'multer';
const upload = multer();
export const getSupportToIncubatorRouter = Router();
import { createSupportToIncubator } from './getSupportToIncubators.controller.js';
getSupportToIncubatorRouter.post(
  '/:postId',
  upload.none(),
  createSupportToIncubator
);
