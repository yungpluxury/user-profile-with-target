const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/unauthorizedError');
const { boolean } = require('joi');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    equired: true,
  },
  lastName: {
    type: String,
    equired: true,
  },
  surname: {
    type: String,
    equired: true,
  },
  login: {
    type: String,
    equired: true,
  },
  cardNumber: {
    type: String,
    equired: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  cards: [
    {
      type: String,
      equired: true,
    }
  ],
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Необходима авторизация.');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Необходима авторизация.');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
