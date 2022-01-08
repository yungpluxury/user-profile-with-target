const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
require('dotenv').config();

const serverErrorRouter = require('./routes/serverError');
const signRouter = require('./routes/sign');
const usersRouter = require('./routes/users');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/rateLimiter');

const options = {
  origin: [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:8081',
    'http://lkbank.bonch-ikt.ru',
    'https://lkbank.bonch-ikt.ru',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization', 'Accept'],
  credentials: true,
};

const app = express();

app.use(helmet());

app.use('*', cors(options));

const { PORT = 3000 } = process.env;
const { DATA_BASE, NODE_ENV } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? DATA_BASE : 'mongodb://localhost:27017/pobedadbtarget');

app.use(requestLogger);

app.use(limiter);

app.use('/', signRouter);

app.use(auth);

app.use('/', usersRouter);

app.use('/', serverErrorRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
