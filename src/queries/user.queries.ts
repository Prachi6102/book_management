import { IUser } from '../interface'
import { Users } from '../models'

export class UserQueries {
  async createUser(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<IUser> {
    return await Users.create({ name, email, password, role })
  }

  async getUsers(): Promise<IUser[]> {
    return await Users.find()
  }

  async findByName(name: string): Promise<IUser | null> {
    return await Users.findOne({ name })
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await Users.findOne({ email })
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await Users.findById(id)
  }

  async findUserByToken(token: string): Promise<IUser | null> {
    return await Users.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    })
  }

  async updateUser(
    id: string,
    name: string,
    role: string
  ): Promise<IUser | null> {
    return await Users.findByIdAndUpdate(id, { name, role }, { new: true })
  }

  async deleteUser(id: string): Promise<IUser | null> {
    return await Users.findByIdAndDelete(id)
  }

  async findByIdAndUpdatePassword(
    id: string,
    password: string
  ): Promise<IUser | null> {
    return await Users.findByIdAndUpdate(id, { $set: { password: password } })
  }
}
