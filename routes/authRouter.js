import { Router } from 'express';
import { postUser, postLogin } from '../controller/authController.js';

const router = Router();

router.route('/signup').post(postUser);
router.route('/login').post(postLogin);

export default router;
