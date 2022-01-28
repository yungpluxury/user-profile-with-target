const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    firstName, lastName, surname, login, cardNumber, phoneNumber, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email уже существует.');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      firstName, lastName, surname, login, cardNumber, phoneNumber, email, password: hash,
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

const updateChild = (req, res, next) => {
  const { email, child } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, child })
    .then(() => {
        res.status(200).send("child updated");
    })
    .catch(next);
};

const updateKomnedv = (req, res, next) => {
  const { email, komnedv } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, komnedv })
    .then(() => {
        res.status(200).send("komnedv updated");
    })
    .catch(next);
};

const updateGknedv = (req, res, next) => {
  const { email, gknedv } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, gknedv })
    .then(() => {
        res.status(200).send("gknedv updated");
    })
    .catch(next);
};

const updateBtech = (req, res, next) => {
  const { email, btech } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, btech })
    .then(() => {
        res.status(200).send("btech updated");
    })
    .catch(next);
};

const updateNewauto = (req, res, next) => {
  const { email, newauto } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, newauto })
    .then(() => {
        res.status(200).send("newauto updated");
    })
    .catch(next);
};

const updateBuauto = (req, res, next) => {
  const { email, buauto } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, buauto })
    .then(() => {
        res.status(200).send("buauto updated");
    })
    .catch(next);
};

const updateFr = (req, res, next) => {
  const { email, fr } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, fr })
    .then(() => {
        res.status(200).send("fr updated");
    })
    .catch(next);
};

const updateSr = (req, res, next) => {
  const { email, sr } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, sr })
    .then(() => {
        res.status(200).send("sr updated");
    })
    .catch(next);
};

const updateMed = (req, res, next) => {
  const { email, med } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, med })
    .then(() => {
        res.status(200).send("med updated");
    })
    .catch(next);
};

const updateOfficetech = (req, res, next) => {
  const { email, officetech } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, officetech })
    .then(() => {
        res.status(200).send("officetech updated");
    })
    .catch(next);
};

const updatePc = (req, res, next) => {
  const { email, pc } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, pc })
    .then(() => {
        res.status(200).send("pc updated");
    })
    .catch(next);
};

const updateGames = (req, res, next) => {
  const { email, games } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, games })
    .then(() => {
        res.status(200).send("games updated");
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
  updateChild,
  updateKomnedv,
  updateGknedv,
  updateBtech,
  updateNewauto,
  updateBuauto,
  updateFr,
  updateSr,
  updateMed,
  updateOfficetech,
  updatePc,
  updateGames,
  login,
  getUser,
};
