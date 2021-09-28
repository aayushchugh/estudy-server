const express = require('express');

const updateEmailListController = require('../controller/updateEmailListController');

const router = express.Router();

router
	.route('/updateEmailList/add')
	.post(updateEmailListController.postNewEmail);

router
	.route('/updateEmailList/get-all')
	.get(updateEmailListController.getAllEmails);

router
	.route('/updateEmailList/unsubscribe')
	.post(updateEmailListController.unSubscribeEmail);

module.exports = router;
