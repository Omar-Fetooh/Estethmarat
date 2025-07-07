import jwt from 'jsonwebtoken';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { AppError } from '../../Utils/AppError.js';
import { SupportToIncubator } from '../../../DB/models/getSupportToIncubator.model.js';
export const getAllNotifications = errorHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  if (decodedToken.role !== 'supportOrganization')
    return next(new AppError('Invalid Token', 400));
  const allSupports = await SupportToIncubator.find().populate('postId');
  const finalSupports = allSupports.filter(
    (item) => item.postId.organizationId == decodedToken.id
  );
  let isSeen = true;
  finalSupports.forEach((item) => {
    if (item.IsSeenByIncubator === false) isSeen = false;
  });
  res.status(200).json({
    status: 'success',
    results: finalSupports.length,
    data: {
      isSeen,
      finalSupports,
    },
  });
});
