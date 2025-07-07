import { Router } from 'express';
export const incubatorNotificationsRouter = Router();
import { getAllNotifications } from './incubator-notifications.controller.js';
incubatorNotificationsRouter.get('/', getAllNotifications);
