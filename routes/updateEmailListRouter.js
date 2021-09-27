import { Router } from 'express';
import { postNewEmail } from '../controller/updateEmailListController.js';

const router = Router();

router.route('/updateEmailList/add').post(postNewEmail);

export default router;
