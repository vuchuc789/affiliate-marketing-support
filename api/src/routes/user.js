const express = require('express');
const passport = require('passport');

const userController = require('../controllers/user');

const router = express.Router();

router.get(
  '/info',
  passport.authenticate('jwt', { session: false }),
  userController.getUserInfo
);

module.exports = router;
