import { Router } from 'express';
import { getAllUsers, deleteUser } from '../controller/userController.js';

const router = Router();

router.route('/users/all-users').get(getAllUsers);
router.route('/users/delete-user/:id').delete(deleteUser);

export default router;
