const express = require('express');
const ncertSolutionController = require('../controllers/ncertSolutionController');

const router = express.Router();

router
	.route('/ncert-solution/add')
	.post(ncertSolutionController.postNewNcertSolution);
router
	.route('/ncert-solution/get-all')
	.get(ncertSolutionController.getAllNcertSolution);
router
	.route('/ncert-solution/get-single/:id')
	.get(ncertSolutionController.getSingleNcertSolution);
router
	.route('/ncert-solution/update/:id')
	.patch(ncertSolutionController.patchNcertSolution);
router
	.route('/ncert-solution/delete/:id')
	.delete(ncertSolutionController.deleteNcertSolution);

module.exports = router;
