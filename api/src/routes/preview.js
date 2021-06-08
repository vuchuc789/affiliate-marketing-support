const express = require('express');

const previewController = require('../controllers/preview');

const router = express.Router();

router.get('/', previewController.linkPreview);

module.exports = router;
