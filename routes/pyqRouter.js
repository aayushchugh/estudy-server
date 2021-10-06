const express = require('express');
const pyqController = require('../controllers/pyqController');

const router = express.Router();

router.route('/pyq/add').post(pyqController.postNewPyq);
router.route('/pyq/get-all').get(pyqController.getAllPyqs);
router.route('/pyq/get-single/:id').get(pyqController.getSinglePyq);
router.route('/pyq/update/:id').patch(pyqController.patchPyq);
router.route('/pyq/delete/:id').delete(pyqController.deletePyq);

module.exports = router;
