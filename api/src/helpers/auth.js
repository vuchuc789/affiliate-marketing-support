const passport = require('passport');
const LocalStrategy = require('passport-local');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const RefreshTokenStrategy = require('passport-refresh-token');
const User = require('../models/user');

// require('dotenv').config();

const emailRegex = /^\S+@\S+\.\S+$/;
const passwordRegex = /^.{6,20}$/;
const jwtSecret = process.env.JWT_KEY || 'secret';

passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        if (!email || !passport) {
          done(null, false, {
            error: 'Email or password is required',
          });
          return;
        }

        if (!emailRegex.test(email)) {
          done(null, false, { error: 'Invalid email' });
          return;
        }

        if (!passwordRegex.test(password)) {
          done(null, false, { error: 'Invalid password' });
          return;
        }

        if (await User.exists({ email })) {
          done(null, false, { error: 'User is already existed' });
          return;
        }

        const newUser = new User({ email, password });
        await newUser.save();

        done(null, newUser, { message: 'Registered successfully' });
      } catch (error) {
        done(error, false, { error: 'Something went wrong' });
      }
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        if (!email || !password) {
          done(null, false, {
            error: 'Email and password is required',
          });
          return;
        }

        const user = await User.findOne({ email });

        if (!user) {
          done(null, false, { error: 'User not found' });
          return;
        }

        if (!(await user.verifyPassword(password))) {
          done(null, false, { error: 'Wrong password' });
          return;
        }

        done(null, user, { message: 'Login successfully' });
      } catch (error) {
        done(error, false, { error: 'Something went wrong' });
      }
    }
  )
);

// jwt strategy
passport.use(
  new JWTStrategy(
    {
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    (token, done) => {
      if (!token) {
        done(null, false, { error: 'Bearer token is required' });
      }

      done(null, token);
    }
  )
);

passport.use(
  new RefreshTokenStrategy(async (token, done) => {
    try {
      const user = await User.findOne({ refreshToken: token });

      if (!user) {
        done(null, false, { error: 'Token not found' });
        return;
      }

      done(null, user);
    } catch (error) {
      done(error, false, { error: 'Something went wrong' });
    }
  })
);
