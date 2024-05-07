import express, { Router } from 'express';
import * as controller from '../controllers/author.controller.ts';
import { authUser, authorize } from '../middleware/auth.ts';
const router: Router = express.Router();

router.get('/', controller.getAuthors);

router.get('/:id', controller.getAuthorById);

router.post('/', authorize(['Admin']), controller.addAuthor);

//update Author
router.put('/:id', authorize(['Admin']), controller.updateAuthor);

//delete Author
router.delete('/:id', authorize(['Admin']), controller.deleteAuthor);

export default router;