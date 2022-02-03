const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');
const products = [
  {
    title: 'Ипотека в ползунках 5.9%',
    url: 'https://i.ibb.co/8KwPNRW/min-banner-polzunki.png',
    card: ['child', 'btech'],
  },
  {
    title: 'Бюджетное решение',
    url: 'https://i.ibb.co/VvKxTv1/br.png',
    card: 'officetech',
  },
  {
    title: 'Кредит для своих',
    url: 'https://i.ibb.co/sjJmwS6/ks.png',
    card: ['buauto', 'newauto'],
  },
  {
    title: 'Ипотека на коммерческую недвижимость',
    url: 'https://i.ibb.co/Tr8nDKS/252x150-ipoteka-na-komercheskuyu-nedvizhimost.png',
    card: 'komnedv',
  },
  {
    title: 'Особая ипотека',
    url: 'https://i.ibb.co/jb0yyyj/special-mortgage-minbanner.png',
    card: 'gknedv',
  },
  {
    title: 'Пенсионная карта',
    url: 'https://i.ibb.co/t2jkVmY/pensionnaya-karta.png',
    card: 'fr',
  },
  {
    title: 'Ипотека на первичном рынке от 9,54%',
    url: 'https://i.ibb.co/0GLQtPv/min-banner-pervichniy-rinok.png',
    card: 'fr',
  },
  {
    title: 'Ипотека на вторичном рынке от 9,54%',
    url: 'https://i.ibb.co/cXx3YCH/ipoteka-na-vtorichnom-rinke-minbanner.png',
    card: 'sr',
  },
  {
    title: 'Социальная карта',
    url: 'https://i.ibb.co/zQFzYvN/virtualnaya-karta.png',
    card: ['games', 'pc'],
  },
];

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    firstName, lastName, surname, login, cardNumber, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email уже существует.');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      firstName, lastName, surname, login, cardNumber, email, password: hash,
    })
      .then((user) => res.status(200).send({
          _id: user._id,
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError('Введены невалидные данные.');
        }
        return next(err);
      }))
    .catch(next);
};

const addCard = (req, res, next) => {
  const { email, card } = req.body;
  let cards = [];
  User.findById(req.user._id)
    .then((user) => {
      cards = user.cards;
    })
    .then(() => {
      cards.push(card);
    })
    .then(() => {
      User.findByIdAndUpdate(req.user._id, { email, cards })
        .then((user) => {
          res.status(200).send('success add');
      })
      .catch(next);
    })
}

const deleteCard = (req, res, next) => {
  const { email, cardsfordelete } = req.body;
  let cards = [];
  let cardsBeforeDelete = [];
  User.findById(req.user._id)
    .then((user) => {
      cardsBeforeDelete = user.cards;
    })
    .then(() => {
      cards = cardsBeforeDelete.filter(function(card) {
        return cardsfordelete.indexOf(card) < 0;
      });
    })
    .then(() => {
      User.findByIdAndUpdate(req.user._id, { email, cards })
        .then((user) => {
          res.status(200).send('success delete');
      })
      .catch(next);
    })
}

const getProducts = (req, res, next) => {
  let productList = [];
  User.findById(req.user._id)
    .then((user) => {
      if (user.cards.includes('fr')) {
        productList = productList.concat(products[6]);
      }
      if (user.cards.includes('sr')) {
        productList = productList.concat(products[7]);
      }
      if (user.cards.includes('officetech')) {
        productList = productList.concat(products[1]);
      }
      if (user.cards.includes('komnedv')) {
        productList = productList.concat(products[3]);
      }
      if (user.cards.includes('med')) {
        productList = productList.concat(products[5]);
      }
      if (user.cards.includes('games') && user.cards.includes('pc')) {
        productList = productList.concat(products[8]);
      }
      if (user.cards.includes('child') && user.cards.includes('btech')) {
        productList = productList.concat(products[0]);
      }
      if (user.cards.includes('gknedv')) {
        productList = productList.concat(products[4]);
      }
      if (user.cards.includes('buauto') || user.cards.includes('newauto')) {
        productList = productList.concat(products[2]);
      }
    })
    .then(() => {
      res.status(200).send({list: productList});
    })
    .catch(next);
}

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
        res.status(200).send({
            firstName: user.firstName,
            surname: user.surname,
            lastName: user.lastName,
            login: user.login,
            cardNumber: user.cardNumber,
            email: user.email,
        });
      }
    })
    .catch(next);
};


module.exports = {
  createUser,
  login,
  getUser,
  addCard,
  deleteCard,
  getProducts,
};
