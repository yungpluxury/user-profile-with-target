const router = require('express').Router();
const { getUser, updateTarget } = require('../controllers/users');
router.get('/api/getuser', getUser);
router.patch('/api/updatetarget', updateTarget);
module.exports = router;