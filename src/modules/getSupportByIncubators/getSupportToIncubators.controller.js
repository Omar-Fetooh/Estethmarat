import jwt from 'jsonwebtoken';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { AppError } from '../../Utils/AppError.js';
import { SupportToIncubator } from '../../../DB/models/getSupportToIncubator.model.js';
export const createSupportToIncubator = errorHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { message } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  if (decodedToken.role !== 'company')
    return next(new AppError('Invalid Token', 400));
  const supportForIncubator = await SupportToIncubator.create({
    message,
    companyId: decodedToken.id,
    postId,
  });
  res.status(201).json({
    status: 'success',
    data: {
      supportForIncubator,
    },
  });
});
