import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { AppError } from '../../Utils/AppError.js';
import jwt from 'jsonwebtoken';
import { requestConsultation } from '../../../DB/models/consultaion.model.js';
import multer from 'multer';
export const upload = multer();
export const createConsultationReply = errorHandler(async (req, res, next) => {
  const { consultationId } = req.params;
  const { investorReply } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  if (decodedToken.role !== 'investor')
    return next(
      new AppError('You are not authorized to reply a consultation!', 401)
    );
  if (!(await requestConsultation.findById(consultationId)))
    return next(new AppError('Consultation not found!', 404));
  const updatedConsultation = await requestConsultation.findByIdAndUpdate(
    consultationId,
    {
      investorIsReplied: true,
      investorReply,
      consultaionState: true,
    },
    {
      runValidators: true,
      new: true,
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      updatedConsultation,
    },
  });
});
