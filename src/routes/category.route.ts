import express, { Router } from 'express';
import * as controller from '../controllers/category.controller';
import { authorize } from '../middleware/auth';
const router: Router = express.Router();

router.get('/', controller.getCategories);

router.get('/:id', controller.getCategoryById);

router.post('/', authorize(['Admin']), controller.addCategory);

//update product
router.put('/:id', authorize(['Admin']), controller.updateCategory);

//delete product
router.delete('/:id', authorize(['Admin']), controller.deleteCategory);

export default router;