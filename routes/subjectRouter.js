const express = require('express');
const subjectController = require('../controllers/subjectController');

const router = express.Router();

router.route('/subject/add').post(subjectController.postNewSubject);

module.exports = router;
