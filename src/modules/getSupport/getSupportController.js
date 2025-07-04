import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { AppError } from '../../Utils/AppError.js';
import { Post } from '../../../DB/models/Post.model.js';
import { GetSupport } from '../../../DB/models/getSupport.model.js';

import jwt from 'jsonwebtoken';
export const createGettingSupport = errorHandler(async (req, res, next) => {
  const supporterToken = req.headers.authorization.split(' ')[1];
  const { postId } = req.params;
  const { message } = req.body;
  const decoded = jwt.verify(supporterToken, process.env.SECRET_KEY);
  if (!decoded) return next(new AppError('Invalid token', 401));
  if (!(await Post.findById(postId)))
    return next(new AppError('post not found', 404));
  const newSupport = await GetSupport.create({
    message,
    postId,
    supporterRole: decoded.role.charAt(0).toUpperCase() + decoded.role.slice(1),
    supportIntroducer: decoded.id,
  });
  res.status(201).json({
    status: 'success',
    data: {
      newSupport,
    },
  });
});
