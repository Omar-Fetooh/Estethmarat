import { Router } from 'express';

export const consultationRouter = Router();
import { createConsultaion, upload } from './consultation.controller.js';
consultationRouter.route('/:investorId').post(upload.none(), createConsultaion);
