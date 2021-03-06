const express = require('express');
const classController = require('../controllers/classController');

const router = express.Router();

router.route('/class/add').post(classController.postNewClass);
router.route('/class/get-all').get(classController.getAllClasses);
router.route('/class/get-single/:id').get(classController.getSingleClass);
router.route('/class/update/:id').patch(classController.patchClass);
router.route('/class/delete/:id').delete(classController.deleteClass);

module.exports = router;
