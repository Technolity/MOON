const express = require('express');
const cronController = require('./cron.controller');

const router = express.Router();

// Secured by X-Cron-Secret header — no JWT (cron callers can't log in)
router.post('/weekly-digest', cronController.weeklyDigest);

module.exports = router;
