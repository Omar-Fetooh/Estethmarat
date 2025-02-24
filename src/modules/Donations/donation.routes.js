import { Router } from 'express';

import * as middlewares from '../../middlewares/index.js';
import {
  addDonation,
  deleteDonationById,
  getAllDonations,
  getDonationById,
  updateDonationById,
} from './donation.controller.js';

export const donationRouter = Router();

const { auth } = middlewares;

const { errorHandler } = middlewares;

donationRouter.post('/', errorHandler(addDonation));
donationRouter.get('/', errorHandler(getAllDonations));

donationRouter.get('/:donationId', errorHandler(getDonationById));
donationRouter.patch('/:donationId', errorHandler(updateDonationById));
donationRouter.delete('/:donationId', errorHandler(deleteDonationById));
