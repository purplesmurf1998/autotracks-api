const router = require('express').Router();
const {
  register,
  login,
  verify,
  logout
} = require('../controllers/auth');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/verify').get(verify);

module.exports = router;