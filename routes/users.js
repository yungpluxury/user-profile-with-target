const router = require('express').Router();
const { getUser, updateTarget } = require('../controllers/users');
router.get('/getuser', getUser);
router.patch('/updatetarget', updateTarget);
module.exports = router;