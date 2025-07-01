import { RequestConsultation } from '../../../DB/models/RequestConsultation.model.js';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { AppError } from '../../Utils/AppError.js';
import jwt from 'jsonwebtoken';
export const createConsultationReply = errorHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const { consultationId } = req.params;
  const { investorReplied } = req.body;
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  if (decodedToken.role !== 'investor')
    next(
      new AppError('You are not authorized to reply to a consultation', 401)
    );
  if (!(await RequestConsultation.findById(consultationId)))
    return next(new AppError('Consultation not found', 404));
  const updatedConsultation = await RequestConsultation.findByIdAndUpdate(
    consultationId,
    {
      investorIsReplied: true,
      investorReplied,
      IsSeenByInvestor: true,
    },
    { runValidators: true, new: true }
  );
  res.status(200).json({
    status: 'success',
    message: 'Consultation reply updated successfully',
    data: {
      updatedConsultation,
    },
  });
});
