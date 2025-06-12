import { Router } from 'express';
export const TopThreeInvestorRouter = Router();
import { getTopThreeInvestors } from './statisticsInvestor.controller.js';
TopThreeInvestorRouter.get('/', getTopThreeInvestors);
