import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { IUser } from '../interface'
import { UserQueries } from '../queries'
import { SUCCESS_MSG, ERROR_MSG } from '../constants/messages'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
// const blacklistedTokens: string[] = []

dotenv.config()

const PORT: number = parseInt(process.env.PORT || '3000')
const SECRET_KEY: string = process.env.SECRET_KEY || ''

const userQueries = new UserQueries()

export class UserServices {
  async getUsers(): Promise<IUser[]> {
    const Users = await userQueries.getUsers()
    if (Users.length == 0) {
      throw new Error(ERROR_MSG.NO_CONTENT('User'))
    } else {
      return Users
    }
  }

  async getUserById(id: string): Promise<IUser | string> {
    const User = await userQueries.getUserById(id)
    if (User) {
      return User
    } else {
      return 'User not found!!'
    }
  }

  async addUser(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<IUser | string> {
    //check if user with the same name already exists
    const existingUser: IUser | null = await userQueries.findByName(name)
    if (existingUser) {
      return 'User with this name already exists!!'
    } else {
      //hash the password
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      password = hashedPassword
      const user: IUser = await userQueries.createUser(
        name,
        email,
        password,
        role
      )
      return user
    }
  }

  async updateUser(
    id: string,
    name: string,
    role: string
  ): Promise<IUser | string> {
    const existingUser: IUser | null = await userQueries.getUserById(id)
    if (!existingUser) {
      return 'User not found!'
    } else {
      let updatedName = existingUser.name

      if (name !== existingUser.name) {
        // Check if the new name is already taken
        const existingNameUser: IUser | null =
          await userQueries.findByName(name)
        if (existingNameUser) {
          return 'Username already exists!'
        }
        updatedName = name
      }

      const updatedUser: IUser | null = await userQueries.updateUser(
        id,
        updatedName,
        role
      )
      if (!updatedUser) {
        return 'Failed to update user!'
      } else {
        return updatedUser
      }
    }
  }

  async deleteUser(id: string): Promise<string | undefined> {
    const deletedUser = await userQueries.deleteUser(id)
    if (!deletedUser) {
      return 'User not found!'
    } else {
      return 'User deleted successfully!'
    }
  }

  async loginUser(
    name: string,
    password: string,
    role: string
  ): Promise<string> {
    const user: IUser | null = await userQueries.findByName(name)
    if (!user) {
      return 'User not found!'
    }

    //compare the hashed password from the database with the plaintext password
    const passwordMatch: boolean = await bcrypt.compare(
      password,
      user.password as string
    )
    if (!passwordMatch) {
      return 'Invalid password'
    } else if (user.role !== role) {
      return 'No user found with this role.'
    } else {
      const userPayload: JwtPayload = {
        name: user.name,
        u_id: user._id,
        role: user.role
      }
      const token = jwt.sign(userPayload, SECRET_KEY, { expiresIn: '12h' })
      // localStorage.setItem('token', token);
      console.log('User Token : ', token)
      // res.json({ token })
      return 'Login Successful!'
    }
  }

  async changePassword(
    id: string,
    password: string,
    confirmPassword: string
  ): Promise<string | undefined> {
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        return "New Password and Confirm New Password doesn't match"
      } else {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        password = hashedPassword
        await userQueries.findByIdAndUpdatePassword(id, password)
        return 'Password changed successfully!!'
      }
    } else {
      return 'All fields are required!!'
    }
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await userQueries.findByEmail(email)
    if (!user) {
      return 'User with this email does not exist!!'
    }

    const token = crypto.randomBytes(20).toString('hex')

    user.resetPasswordToken = token
    user.resetPasswordExpires = new Date(Date.now() + 3600000) //1 hour
    await user.save()

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
      }
    })

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_FROM,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      http://localhost:${PORT}/reset-password/${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`
    }

    await transporter.sendMail(mailOptions)

    console.log('mail sent')

    return 'Password reset mail sent'
  }

  async resetPassword(token: string, password: string): Promise<string> {
    const user: IUser | null = await userQueries.findUserByToken(token)
    if (!user) {
      return 'Password reset token is invalid or has expired'
    }
    const saltRounds = 10
    user.password = await bcrypt.hash(password, saltRounds)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    return 'Password has been reset'
  }
}

// async logoutUser(): Promise<string> {
//     localStorage.removeItem('token');
//     return "User logged out successfully!!"
// }

// async updateUser(id: string, name: string, password: string, role: string): Promise<IUser | string> {
//     const existingUser: IUser | null = await userQueries.findByName(name);
//     if (existingUser) {
//         return "User with this name already exists!!";
//     } else {
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
//         password = hashedPassword;
//         const updatedUser: IUser | null = await userQueries.updateUser(id, name, password, role);
//         if (!updatedUser) {
//             return "User not found!";
//         } else {
//             return updatedUser;
//         }
//     }
// }
