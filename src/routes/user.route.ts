import express, { Router } from 'express'
import * as controller from '../controllers/user.controller.ts'
import { authUser, authorize } from '../middleware/auth.ts'
const router: Router = express.Router()

router.get('/users', authUser, authorize(['Admin']), controller.getUsers)

router.get('/users/:id', authUser, authorize(['Admin']), controller.getUserById)

router.post('/signup', controller.addUser)

router.post('/login', controller.loginUser)

router.post('/forgot-password', controller.forgotPassword)

router.post('/reset-password/:token', controller.resetPassword)

//change password
router.post('/change-password', authUser, controller.changePassword)

//update User
router.put('/users', authUser, controller.updateUser)

//delete User
router.delete('/users', authUser, controller.deleteUser)

export default router
