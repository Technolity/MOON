const express = require('express');

const {
  requireAdmin,
  requireAuth
} = require('../../core/middleware/require-auth');
const validateRequest = require('../../core/middleware/validate-request');
const notificationsController = require('./notifications.controller');
const {
  sendEmailSchema,
  sendSmsSchema,
  sendWhatsAppSchema
} = require('./notifications.validator');

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.post(
  '/email',
  validateRequest({ body: sendEmailSchema }),
  notificationsController.sendEmail
);
router.post(
  '/sms',
  validateRequest({ body: sendSmsSchema }),
  notificationsController.sendSms
);
router.post(
  '/whatsapp',
  validateRequest({ body: sendWhatsAppSchema }),
  notificationsController.sendWhatsApp
);

module.exports = router;
