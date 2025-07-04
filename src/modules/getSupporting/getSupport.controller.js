import jwt from 'jsonwebtoken';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { AppError } from '../../Utils/AppError.js';
import { GetSupporting } from '../../../DB/models/getSupport.model.js';
import { Post } from '../../../DB/models/post.model.js';
export const createSupporting = errorHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { contentMsg } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  if (!decodedToken)
    return next(new AppError('You are not authorized to make support', 401));
  const post = await Post.findById(postId);
  if (!post) return next(new AppError('No post founded or invalied id', 404));
  let role;
  if (decodedToken.role === 'company') role = 'Company';
  else if (decodedToken.role === 'investor') role = 'Investor';
  else if (decodedToken.role === 'charityOrganization')
    role = 'CharityOrganization';
  const support = await GetSupporting.create({
    contentMsg,
    supporterRole: ''.concat(
      decodedToken.role.split('')[0].toUpperCase(),
      decodedToken.role.slice(1)
    ),
    supporterId: decodedToken.id,
    postId,
  });
  res.status(201).json({
    status: 'success',
    data: {
      support,
    },
  });
});
