import express, { Router } from 'express';
import * as controller from '../controllers/books.controller';
import { authorize } from '../middleware/auth';
const router: Router = express.Router();

router.get('/', controller.getBooks);

router.get('/:id', controller.getBooksById);

router.post('/', authorize(['Admin']), controller.addBook);

//update product
router.put('/:id', authorize(['Admin']), controller.updateBook);

//delete product
router.delete('/:id', authorize(['Admin']), controller.deleteBook);

export default router;