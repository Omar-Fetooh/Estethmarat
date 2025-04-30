import { Router } from 'express';

import * as middlewares from '../../middlewares/index.js';

import { multerHost } from '../../middlewares/multer.middleware.js';
import { extensions } from '../../Utils/index.js';
import {
  createPost,
  deletePostById,
  getAllPosts,
  getPostById,
  updatePostById,
} from './post.controller.js';
const { auth } = middlewares;

const { errorHandler } = middlewares;

export const postRouter = Router();

postRouter.post(
  '/add',
  multerHost({ allowedExtensions: extensions.Images }).single('attachedImage'),
  errorHandler(createPost)
);

postRouter.get('/', errorHandler(getAllPosts));
postRouter.get('/:postId', errorHandler(getPostById));
postRouter.put(
  '/:postId',
  multerHost({ allowedExtensions: extensions.Images }).single('attachedImage'),
  errorHandler(updatePostById)
);
postRouter.delete('/:postId', errorHandler(deletePostById));
