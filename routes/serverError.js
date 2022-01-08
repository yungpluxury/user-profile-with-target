const router = require('express').Router();
const NotFoundError = require('../errors/notFoundError');

router.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
