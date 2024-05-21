import express, { Router } from 'express'
import userRoute from './user.route.ts'
import categoryRoute from './category.route.ts'
import authorRoute from './author.route.ts'
import bookRoute from './books.route.ts'
import { authUser } from '../middleware/auth'

const router: Router = express.Router()

router.use('/', userRoute)
router.use('/categories', authUser, categoryRoute)
router.use('/authors', authUser, authorRoute)
router.use('/books', authUser, bookRoute)

export default router
