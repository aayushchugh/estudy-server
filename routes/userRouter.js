import { Router } from 'express';
import { getAllUsers } from '../controller/userController.js';

const router = Router();

router.route('/users/all-users').get(getAllUsers);

export default router;
