const express = require('express');

const updateEmailListController = require('../controller/updateEmailListController');

const router = express.Router();

router
	.route('/updateEmailList/add')
	.post(updateEmailListController.postNewEmail);

module.exports = router;
