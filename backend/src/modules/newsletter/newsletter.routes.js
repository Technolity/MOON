const express = require('express');
const validateRequest = require('../../core/middleware/validate-request');
const { requireAuth, requireAdmin } = require('../../core/middleware/require-auth');
const newsletterController = require('./newsletter.controller');
const { subscribeSchema, unsubscribeSchema, broadcastSchema } = require('./newsletter.validator');

const publicRouter = express.Router();
const adminRouter = express.Router();

publicRouter.post('/subscribe', validateRequest({ body: subscribeSchema }), newsletterController.subscribe);
publicRouter.post('/unsubscribe', validateRequest({ body: unsubscribeSchema }), newsletterController.unsubscribe);

adminRouter.use(requireAuth, requireAdmin);
adminRouter.get('/subscribers', newsletterController.listSubscribers);
adminRouter.post('/broadcast', validateRequest({ body: broadcastSchema }), newsletterController.broadcast);

module.exports = { public: publicRouter, admin: adminRouter };
