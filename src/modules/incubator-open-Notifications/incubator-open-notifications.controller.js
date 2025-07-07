import jwt from 'jsonwebtoken';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { AppError } from '../../Utils/AppError.js';
import { SupportToIncubator } from '../../../DB/models/getSupportToIncubator.model.js';
export const updateNotification = errorHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  if (decodedToken.role !== 'supportOrganization')
    return next(new AppError('Invalid Token', 400));
  const allSupports = await SupportToIncubator.find().populate('postId');
  const finalSupports = allSupports.filter(
    (item) => item.postId.organizationId == decodedToken.id
  );
  const updatedSupports = await Promise.all(
    finalSupports.map(
      async (item) =>
        await SupportToIncubator.findByIdAndUpdate(
          item._id,
          { IsSeenByIncubator: true },
          { runValidators: true, new: true }
        ).populate('postId')
    )
  );
  res.status(200).json({
    status: 'success',
    results: updatedSupports.length,
    data: {
      updatedSupports,
    },
  });
});
