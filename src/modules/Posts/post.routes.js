import { Router } from 'express';

import * as middlewares from '../../middlewares/index.js';

import { multerHost } from '../../middlewares/multer.middleware.js';
import { extensions } from '../../Utils/index.js';
import { createPost } from './post.controller.js';
const { auth } = middlewares;

const { errorHandler } = middlewares;

export const postRouter = Router();

postRouter.post(
  '/add',
  multerHost({ allowedExtensions: extensions.Images }).single('image'),
  errorHandler(createPost)
);
