const passport = require('passport');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const jwtSecret = process.env.JWT_KEY;
// 120 minutes
const accessTokenAge = 120 * 60;

const User = require('../models/user');

const getTokens = async (user) => {
  if (!(user instanceof User)) {
    return;
  }
  let { _id, email, refreshToken } = user;

  const tokenPayload = {
    id: _id,
    email,
    rand: Math.round(Math.random() * 100000),
  };

  const accessToken = jwt.sign(tokenPayload, jwtSecret, {
    expiresIn: accessTokenAge,
  });

  if (!refreshToken) {
    refreshToken = jwt.sign(tokenPayload, jwtSecret);
    user.refreshToken = refreshToken;
    await user.save();
  }

  return { accessToken, refreshToken };
};

// create new user, return tokens
const register = (req, res, next) => {
  passport.authenticate('signup', { session: false }, (err, user, info) => {
    try {
      if (err || !user) {
        res.json(info);
        return;
      }

      res.json({
        message: 'Register successfully',
        user_id: user._id,
        email: user.email,
      });
    } catch (error) {
      res.json({ message: 'Something went wrong' });
    }
  })(req, res, next);
};

// get tokens by password
const login = async (req, res, next) => {
  passport.authenticate(
    'login',
    { session: false },
    async (err, user, info) => {
      try {
        if (err || !user) {
          res.json(info);
          return;
        }

        const { accessToken, refreshToken } = await getTokens(user);

        res.json({
          message: 'Login successfully',
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      } catch (error) {
        res.json({ message: 'Something went wrong' });
      }
    }
  )(req, res, next);
};

const getNewToken = (req, res, next) => {
  passport.authenticate(
    'refresh_token',
    { session: false },
    async (err, user, info) => {
      try {
        if (err || !user) {
          res.json(info);
          return;
        }

        const { accessToken } = await getTokens(user);

        res.json({
          message: 'New token was generated',
          access_token: accessToken,
        });
      } catch (error) {
        res.json({ message: 'Something went wrong' });
      }
    }
  )(req, res, next);
};

const logout = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, token, info) => {
    try {
      if (err || !token) {
        res.json(info);
        return;
      }

      const user = await User.findById(token.id);

      if (!user) {
        res.json({ message: 'User not found' });
        return;
      }

      user.refreshToken = '';
      await user.save();

      res.json({ message: 'You are logged out' });
    } catch (error) {
      res.json({ message: 'Something went wrong' });
    }
  })(req, res, next);
};

const facebookAuth = (req, res) => {
  passport.authenticate(
    'facebook-token',
    { session: false },
    async (err, user, info) => {
      try {
        if (err || !user) {
          res.json(info);
          return;
        }

        const { refreshToken, accessToken } = await getTokens(user);

        res.json({
          message: 'Login successfully',
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      } catch (error) {
        res.json({ message: 'Something went wrong' });
      }
    }
  )(req, res);
};

const googleAuth = (req, res) => {
  passport.authenticate(
    'google-verify-token',
    { session: false },
    async (err, user, info) => {
      try {
        if (err || !user) {
          res.json(info);
          return;
        }

        const { refreshToken, accessToken } = getTokens(user);

        res.json({
          message: 'Login successfully',
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      } catch (error) {
        res.json({ message: 'Something went wrong' });
      }
    }
  )(req, res);
};

module.exports = {
  register,
  login,
  getNewToken,
  logout,
  facebookAuth,
  googleAuth,
};
