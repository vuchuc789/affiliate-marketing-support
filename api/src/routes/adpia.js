const express = require('express');
const passport = require('passport');

const adpiaController = require('../controllers/adpia');

const router = express.Router();

router.get(
  '/get',
  passport.authenticate('jwt', { session: false }),
  adpiaController.getInfo
);
router.post(
  '/set',
  passport.authenticate('jwt', { session: false }),
  adpiaController.setInfo
);
router.get(
  '/coupons',
  passport.authenticate('jwt', { session: false }),
  adpiaController.getCoupons
);

module.exports = router;
