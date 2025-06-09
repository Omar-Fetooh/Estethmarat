import { Router } from 'express';

import * as middlewares from '../../middlewares/index.js';

import { multerHost } from '../../middlewares/multer.middleware.js';
import { extensions } from '../../Utils/index.js';
import {
  createPost,
  deletePostById,
  editPostById,
  getAllPostsOfOrganization,
  getPostById,
  // updatePostById,
} from './post.controller.js';
import { protect } from '../auth/authController.js';
const { auth } = middlewares;

const { errorHandler } = middlewares;

export const postRouter = Router();

postRouter.post(
  '/add',
  multerHost({ allowedExtensions: extensions.Images }).single('attachedImage'),
  protect,
  errorHandler(createPost)
);

postRouter.get('/', errorHandler(getAllPostsOfOrganization));
postRouter.get('/:postId', errorHandler(getPostById));
postRouter.put(
  '/:postId',
  multerHost({ allowedExtensions: extensions.Images }).single('attachedImage'),
  protect,
  errorHandler(editPostById)
);
postRouter.delete('/:postId', errorHandler(deletePostById));
