const express = require('express');
const classController = require('../controllers/classController');

const router = express.Router();

router.route('/class/add').post(classController.postNewClass);

module.exports = router;
