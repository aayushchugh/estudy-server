const express = require('express');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.route('/users/all-users').get(userController.getAllUsers);
router.route('/users/update/:id').patch(userController.patchUser);
router.route('/users/delete-user/:id').delete(userController.deleteUser);

module.exports = router;
