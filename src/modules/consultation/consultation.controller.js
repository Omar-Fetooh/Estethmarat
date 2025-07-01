import multer from 'multer';
import jwt from 'jsonwebtoken';
import { AppError } from '../../Utils/AppError.js';
import { errorHandler } from '../../middlewares/error-handling.middleware.js';
import { Investor } from '../../../DB/models/investor.model.js';
import { requestConsultation } from '../../../DB/models/consultaion.model.js';
export const upload = multer();
export const createConsultaion = errorHandler(async (req, res, next) => {
  // verify the token
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
  if (decodedToken.role !== 'company')
    return next(
      new AppError('You are not authorized to request a consultation!', 401)
    );
  if (!(await Investor.findById(req.params.investorId)))
    return next(new AppError('Investor not found!', 404));
  const consultaion = await requestConsultation.create({
    consultationContent: req.body.content,
    company: decodedToken.id,
    investor: req.params.investorId,
  });
  res.status(201).json({
    status: 'success',
    data: {
      consultaion,
    },
  });
});
