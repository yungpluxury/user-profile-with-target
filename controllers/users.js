const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');
const products = [
  {
    title: 'Ипотека в ползунках 5.9%',
    url: 'https://downloader.disk.yandex.ru/preview/ab2d333ed9227a0423675f8baf9a086761666543cdb207cd52b9b1128d78e507/61f7462a/EboLgUMePJFuw1c-u061QpVt-scR-kV8ux4IMtsEd1UNOZmRsOLC6StYWekL0dYsNDPCsuLsLTFS_b-OfdJDUQ%3D%3D?uid=0&filename=min-banner-polzunki.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v2&size=1920x947',
  },
  {
    title: 'Бюджетное решение',
    url: 'https://downloader.disk.yandex.ru/preview/5f0b198c2f7973160a8df0036b45f1ee0217a7712091fa3db866310a86982f27/61f7603b/5aokaZ30vg2Ro2ppCmzx45Vt-scR-kV8ux4IMtsEd1WvgWB9jzZf7zy_Cuyi6iPN8andOmm25ARm-fmKTYdtNg%3D%3D?uid=0&filename=br.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v2&size=1920x947',
  },
  {
    title: 'Кредит для своих',
    url: 'https://downloader.disk.yandex.ru/preview/be05b5c48fd2bde7d0c16d6f4d3e95f6a64a38c8abc3111cd36a344fc7caf4ac/61f76048/kFDhSnx-WA7I2shunjD2G5Vt-scR-kV8ux4IMtsEd1U9CTxKUjDmLN0ER-qSi5fttHO0-AGeJm1yNkjVTvmCgQ%3D%3D?uid=0&filename=ks.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v2&size=1920x947',
  },
  {
    title: 'Ипотека на коммерческую недвижимость',
    url: 'https://downloader.disk.yandex.ru/preview/32661bc752650a5502d28857d5df22c11f03b5f4c1a28de77f1f51b8702f202c/61f76056/U6sfdNBwHmS_yhTpHRdfw5Vt-scR-kV8ux4IMtsEd1Udr-9WK7zF186TRItI7eVZFda28Lex3lTtJHJC83ec2w%3D%3D?uid=0&filename=252x150-ipoteka-na-komercheskuyu-nedvizhimost.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v2&size=1920x947',
  },
  {
    title: 'Особая ипотека',
    url: 'https://downloader.disk.yandex.ru/preview/45bb0415513e7ba1e109388ce1dab291a4ca0b6d9a3bb4226af9ae93fbd00d2e/61f76063/Ezct-Ir9sadc8bCIAtVqoZVt-scR-kV8ux4IMtsEd1XvNs60zjbGfdDHeFhqZU0a71SfD0vz-9aUY4lOnDUHlg%3D%3D?uid=0&filename=special-mortgage-minbanner.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v2&size=1920x947',
  },
  {
    title: 'Пенсионная карта',
    url: 'https://downloader.disk.yandex.ru/preview/45f856e4f6588d897099b98676015933452243b0f1087562e3c3fd3287659cbf/61f76072/OuMvtj8oWoAgNq8V18SGTZVt-scR-kV8ux4IMtsEd1W49xA7-d1M9FLpPJepBPmnIAHuVFRgZBiFrQfaajQ7pA%3D%3D?uid=0&filename=pensionnaya-karta.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v2&size=1920x947',
  },
  {
    title: 'Ипотека на первичном рынке от 9,54%',
    url: 'https://downloader.disk.yandex.ru/preview/a16ad2836d7fc83be0ed60ae7c6b356008343ed3bb7ebf8236de5beb6869f395/61f76083/TiJgUx3MiykEv27lBMrqEHAWZ9m4oBVKmFovEt3kfQ5J03AJqXAhLvXUgj5I5iaE3nCr5L4m8N5jtlo_lhNPUQ%3D%3D?uid=0&filename=min-banner-pervichniy-rinok.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v2&size=1920x947',
  },
  {
    title: 'Ипотека на вторичном рынке от 9,54%',
    url: 'https://downloader.disk.yandex.ru/preview/5b4401ea7c831628ac4aa1554016ddfbec233d37ebac29ebbace52177f36392d/61f760ab/1U5zaRYlW5zwpse_IHc7-5Vt-scR-kV8ux4IMtsEd1WLThrBL-B9ghpAQ5h1QKE4-B3EO1dEeSfV1xfYBCDM3Q%3D%3D?uid=0&filename=ipoteka-na-vtorichnom-rinke_minbanner.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v2&size=1920x947',
  },
  {
    title: 'Социальная карта',
    url: 'https://downloader.disk.yandex.ru/preview/7bfad5490abff700dacc604e065684df90e0c77c079a2fd135afdca1ec964e43/61f760b6/vcR_bFtosdhjV6yLHBBjTJVt-scR-kV8ux4IMtsEd1VrzKfC5KM_8NlPPHBHgTFlswS6RRBHxuKmdgc9O96ctw%3D%3D?uid=0&filename=virtualnaya-karta.png&disposition=inline&hash=&limit=0&content_type=image%2Fpng&owner_uid=0&tknv=v2&size=1920x947',
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
  const { email, card } = req.body;
  let cards = [];
  let cardsForDelete = [];
  cardsForDelete.push(card);
  let cardsBeforeDelete = [];
  User.findById(req.user._id)
    .then((user) => {
      cardsBeforeDelete = user.cards;
    })
    .then(() => {
      cards = cardsBeforeDelete.filter(function(card) {
        return cardsForDelete.indexOf(card) < 0;
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
