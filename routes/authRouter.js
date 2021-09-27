const express = require('express');
const authController = require('../controller/authController');

const router = express.Router();

router.route('/signup').post(authController.postUser);
router.route('/login').post(authController.postLogin);

module.exports = router;
