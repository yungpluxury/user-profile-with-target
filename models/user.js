const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const UnauthorizedError = require('../errors/unauthorizedError');
const { boolean } = require('joi');

const userSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    equired: true,
  },
  phoneNumber: {
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
  child: {
    type: Boolean,
    required: false,
  },
  komnedv: {
    type: Boolean,
    required: false,
  },
  gknedv: {
    type: Boolean,
    required: false,
  },
  btech: {
    type: Boolean,
    required: false,
  },
  newauto: {
    type: Boolean,
    required: false,
  },
  buauto: {
    type: Boolean,
    required: false,
  },
  fr: {
    type: Boolean,
    required: false,
  },
  sr: {
    type: Boolean,
    required: false,
  },
  med: {
    type: Boolean,
    required: false,
  },
  officetech: {
    type: Boolean,
    required: false,
  },
  pc: {
    type: Boolean,
    required: false,
  },
  games: {
    type: Boolean,
    required: false,
  },
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
