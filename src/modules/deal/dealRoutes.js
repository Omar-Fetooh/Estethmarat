import { Router } from 'express';
import { protect } from './../auth/authController.js';
export const dealRouter = Router();
import {
  getAllDeals,
  createDeal,
  getDeal,
  updateDeal,
  deleteDeal,
} from './dealController.js';
dealRouter.route('/').get(getAllDeals).post(createDeal);
dealRouter
  .route('/:id')
  .get(protect, getDeal)
  .patch(updateDeal)
  .delete(deleteDeal);
