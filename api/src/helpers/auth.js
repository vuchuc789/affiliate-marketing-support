const passport = require('passport');
const LocalStrategy = require('passport-local');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const RefreshTokenStrategy = require('passport-refresh-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-verify-token').Strategy;
const User = require('../models/user');

// require('dotenv').config();

const emailRegex = /^\S+@\S+\.\S+$/;
const passwordRegex = /^.{6,20}$/;
const jwtSecret = process.env.JWT_KEY || 'secret';
const facebookAppId = process.env.FACEBOOK_APP_ID;
const facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
const googleAppId = process.env.GOOGLE_APP_ID;

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
            message: 'Email or password is required',
          });
          return;
        }

        if (!emailRegex.test(email)) {
          done(null, false, { message: 'Invalid email' });
          return;
        }

        if (!passwordRegex.test(password)) {
          done(null, false, { message: 'Invalid password' });
          return;
        }

        if (await User.exists({ email })) {
          done(null, false, { message: 'User is already existed' });
          return;
        }

        const newUser = new User({ email, password });
        await newUser.save();

        done(null, newUser);
      } catch (error) {
        done(error, false, { message: 'Something went wrong' });
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
            message: 'Email and password is required',
          });
          return;
        }

        const user = await User.findOne({ email });

        if (!user) {
          done(null, false, { message: 'User not found' });
          return;
        }

        if (!(await user.verifyPassword(password))) {
          done(null, false, { message: 'Wrong password' });
          return;
        }

        done(null, user);
      } catch (error) {
        done(error, false, { message: 'Something went wrong' });
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
        done(null, false, { message: 'Bearer token is required' });
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
        done(null, false, { message: 'Token not found' });
        return;
      }

      done(null, user);
    } catch (error) {
      done(error, false, { message: 'Something went wrong' });
    }
  })
);

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: facebookAppId,
      clientSecret: facebookAppSecret,
      fbGraphVersion: 'v10.0',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { email } = profile;
        let user = await User.findOne({ email });

        if (!user) {
          user = new User({ email, password: '' });
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, false, { message: 'Something went wrong' });
      }
    }
  )
);

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: googleAppId,
    },
    async (parsedToken, googleId, done) => {
      try {
        const { email } = parsedToken;
        let user = await User.findOne({ email });

        if (!user) {
          user = new User({ email, password: '' });
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, false, { message: 'Something went wrong' });
      }
    }
  )
);
