import { Router } from 'express';
export const charityOpenedNotificationsRouter = Router();
import { updateNotifications } from './charity-open-notifications.controller.js';
charityOpenedNotificationsRouter.get('/', updateNotifications);
