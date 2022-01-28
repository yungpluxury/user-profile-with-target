const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');

router.post('/api/signup', celebrate({
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    surname: Joi.string().required(),
    login: Joi.string().required(),
    cardNumber: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
router.post('/api/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

module.exports = router;
