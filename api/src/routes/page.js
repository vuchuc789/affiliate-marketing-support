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
router.get(
  '/publish',
  passport.authenticate('jwt', { session: false }),
  pageController.publishPage
);
router.get('/:userId', pageController.getPage);

module.exports = router;
