import { Router } from 'express';
export const charityNotificationsRouter = Router();
import { getAllnotifications } from './charity-notifications.controller.js';
charityNotificationsRouter.get('/', getAllnotifications);
