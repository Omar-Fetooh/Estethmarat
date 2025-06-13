import { Router } from 'express';
export const suggestCompanyRouter = Router();
import { protect } from './../auth/authController.js';
import { getRecomendations } from './suggestionCompanies.controller.js';
suggestCompanyRouter.get('/', getRecomendations);
