const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const router = require('./src/routes');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};
const corsOptions = {
  origin: true,
  credentials: true,
  maxAge: 3600,
  optionsSuccessStatus: 200,
};

mongoose.connect(mongoUri, mongoOptions, (err) => {
  if (err) {
    throw err;
  }

  console.log('Mongo connected');
});

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
// handle JSON syntax error
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    res.status(400).json({ error: 'JSON syntax error' });
    return;
  }

  next();
});

// passport
require('./src/helpers/auth');

// router
app.use('/api', router.api);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
