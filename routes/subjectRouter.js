const express = require('express');
const subjectController = require('../controllers/subjectController');

const router = express.Router();

router.route('/subject/add').post(subjectController.postNewSubject);
router.route('/subject/get-all').get(subjectController.getAllSubjects);
router.route('/subject/get-single/:id').get(subjectController.getSingleSubject);

module.exports = router;
