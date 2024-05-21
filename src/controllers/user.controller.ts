import { Request, Response } from 'express'
import { IUser, AuthenticatedRequest } from '../interface'
import { UserServices } from '../services'

const services = new UserServices()

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users: IUser[] | string = await services.getUsers()
    res.status(200).json(users)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const user: IUser | string = await services.getUserById(id)
    res.status(200).json(user)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body
    const user: IUser | string = await services.addUser(
      name,
      email,
      password,
      role
    )
    res.status(200).json(user)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = (req as AuthenticatedRequest).user.u_id
    const { name, role } = req.body
    const updatedUser: IUser | string = await services.updateUser(
      id,
      name,
      role
    )
    res.status(200).json(updatedUser)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = (req as AuthenticatedRequest).user.u_id
    const deletedUser: string | undefined = await services.deleteUser(id)
    res.status(200).json(deletedUser)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, password, role } = req.body
    const login: string = await services.loginUser(name, password, role)
    res.status(200).json(login)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = (req as AuthenticatedRequest).user.u_id
    const { password, confirmPassword } = req.body
    const changePassword = await services.changePassword(
      id,
      password,
      confirmPassword
    )
    res.status(200).json(changePassword)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body
    const mail = services.forgotPassword(email)
    res.status(200).json(mail)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params
    const { password } = req.body
    const resetPassword = services.resetPassword(token, password)
    res.status(200).json(resetPassword)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword
  // logoutUser
}

// const logoutUser = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const logout: string = await services.logoutUser();
//         res.status(200).json(logout);
//     } catch (error: any) {
//         res.status(500).json({ message: error.message })
//     }
// }
