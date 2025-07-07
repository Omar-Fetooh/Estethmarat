import jwt from 'jsonwebtoken';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { AppError } from '../../Utils/AppError.js';
import { GetSupporting } from '../../../DB/models/getSupport.model.js';
export const getAllnotifications = errorHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  if (decodedToken.role !== 'charityOrganization')
    return next(new AppError('Invalid Token', 400));
  const allSupports = await GetSupporting.find().populate('postId');
  const finalSupports = allSupports.filter(
    (item) => item.postId.organizationId == decodedToken.id
  );
  let isSeen = true;
  finalSupports.forEach((item) => {
    if (item.isSeen === false) isSeen = false;
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
