import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { Admin } from '../../../DB/models/admin.js';
import { AppError } from '../../Utils/AppError.js';
export const setAdmin = errorHandler(async (req, res, next) => {
  try {
    const admin = await Admin.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        admin,
      },
    });
  } catch (err) {
    return next(new AppError(err, 403));
  }
});
