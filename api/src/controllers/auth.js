const passport = require('passport');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const jwtSecret = process.env.JWT_KEY;
// 120 minutes
const accessTokenAge = 120 * 60;

const User = require('../models/user');

// create new user, return tokens
const register = (req, res, next) => {
  passport.authenticate('signup', { session: false }, (err, user, info) => {
    if (err || !user) {
      res.json(info);
      return;
    }

    res.json({
      ...info,
      user_id: user._id,
      email: user.email,
    });
  })(req, res, next);
};

// get tokens by password
const login = (req, res, next) => {
  passport.authenticate(
    'login',
    { session: false },
    async (err, user, info) => {
      if (err || !user) {
        res.json(info);
        return;
      }

      const tokenPayload = {
        id: user._id,
        email: user.email,
      };

      const accessToken = jwt.sign(tokenPayload, jwtSecret, {
        expiresIn: accessTokenAge,
      });
      const refreshToken = jwt.sign(tokenPayload, jwtSecret);

      user.refreshToken = refreshToken;
      await user.save();

      res.json({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
  )(req, res, next);
};

const getNewToken = (req, res, next) => {
  passport.authenticate(
    'refresh_token',
    { session: false },
    (err, user, info) => {
      if (err || !user) {
        res.json(info);
        return;
      }

      const tokenPayload = {
        id: user._id,
        email: user.email,
      };

      const accessToken = jwt.sign(tokenPayload, jwtSecret, {
        expiresIn: accessTokenAge,
      });

      res.json({ access_token: accessToken });
    }
  )(req, res, next);
};

const logout = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, token, info) => {
    if (err || !token) {
      res.json(info);
      return;
    }

    const user = await User.findById(token.id);

    if (!user) {
      res.json({ error: 'User not found' });
      return;
    }

    user.refreshToken = '';
    await user.save();

    res.json({ message: 'You are logged out' });
  })(req, res, next);
};

module.exports = {
  register,
  login,
  getNewToken,
  logout,
};
