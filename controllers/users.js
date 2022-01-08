const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    cardNumber, phoneNumber, email, password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email уже существует.');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      cardNumber, phoneNumber, email, password: hash,
    })
      .then((user) => res.status(200).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError('Введены невалидные данные.');
        }
        return next(err);
      }))
    .catch(next);
};

const updateTarget = (req, res, next) => {
  const { email, target } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, target })
    .then(() => {
        res.status(200).send("target updated");
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' },
      );

      res.status(200).send({ token });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким _id.');
      } else {
        res.status(200).send(user);
      }
    })
    .catch(next);
};


module.exports = {
  createUser,
  updateTarget,
  login,
  getUser,
};
