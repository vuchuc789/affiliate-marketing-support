const express = require('express');
const passport = require('passport');

const pageController = require('../controllers/page');

const router = express.Router();

router.post(
  '/store',
  passport.authenticate('jwt', { session: false }),
  pageController.storePage
);
router.get(
  '/load',
  passport.authenticate('jwt', { session: false }),
  pageController.loadPage
);

module.exports = router;
