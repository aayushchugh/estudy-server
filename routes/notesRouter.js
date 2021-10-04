const express = require('express');
const notesController = require('../controllers/notesController');

const router = express.Router();

router.route('/notes/add').post(notesController.postNewNote);

module.exports = router;
