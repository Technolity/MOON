const { z } = require('zod');

const sendEmailSchema = z.object({
  to: z.string().trim().email(),
  subject: z.string().trim().min(1).max(255),
  templateId: z.string().trim().min(1).optional(),
  html: z.string().trim().min(1).optional(),
  text: z.string().trim().min(1).optional(),
  dynamicTemplateData: z.record(z.any()).optional()
});

const sendSmsSchema = z.object({
  to: z.string().trim().min(10).max(20),
  message: z.string().trim().min(1).max(1000)
});

const sendWhatsAppSchema = z.object({
  to: z.string().trim().min(10).max(30),
  message: z.string().trim().min(1).max(2000)
});

module.exports = {
  sendEmailSchema,
  sendSmsSchema,
  sendWhatsAppSchema
};
