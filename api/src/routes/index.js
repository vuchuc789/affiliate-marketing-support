const express = require('express');

const api = express.Router();

api.use('/auth', require('./auth'));
api.use('/page', require('./page'));
api.use('/adpia', require('./adpia'));
api.use('/user', require('./user'));
api.use('/preview', require('./preview'));

module.exports = { api };
