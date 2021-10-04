const express = require('express');
const notesController = require('../controllers/notesController');

const router = express.Router();

router.route('/notes/add').post(notesController.postNewNote);
router.route('/notes/get-all').get(notesController.getAllNotes);
router.route('/notes/get-single/:id').get(notesController.getSingleNote);

module.exports = router;
