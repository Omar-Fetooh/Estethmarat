import { Router } from 'express';
export const incubatorOpenedNotificationsRouter = Router();
import { updateNotification } from './incubator-open-notifications.controller.js';
incubatorOpenedNotificationsRouter.get('/', updateNotification);
