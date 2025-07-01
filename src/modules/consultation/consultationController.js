import jwt from 'jsonwebtoken';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { RequestConsultation } from '../../../DB/models/RequestConsultation.model.js';
import { AppError } from '../../Utils/AppError.js';
import { Investor } from '../../../DB/models/investor.model.js';

export const createRequestConsultation = errorHandler(
  async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const { investorId } = req.params;
    const { content } = req.body;
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    if (decodedToken.role !== 'company')
      return next(
        new AppError('You are not authorized to request a consultation', 401)
      );
    if (!(await Investor.findById(investorId)))
      return next(new AppError('Investor not found', 404));
    const RequestConsultationRes = await RequestConsultation.create({
      content,
      investor: investorId,
      company: decodedToken.id,
    });
    res.status(201).json({
      status: 'success',
      message: 'consultation request created successfully',
      data: {
        RequestConsultationRes,
      },
    });
  }
);
