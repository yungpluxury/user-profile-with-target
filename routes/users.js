const router = require('express').Router();
const { addCard, deleteCard, getProducts, getUser } = require('../controllers/users');
router.get('/api/getuser', getUser);
router.patch('/api/addcard', addCard);
router.patch('/api/deletecard', deleteCard);
router.get('/api/getproducts', getProducts)
module.exports = router;