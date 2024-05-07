import { IUser } from "../interface";
import { Users } from "../models";

export class UserQueries {
    async createUser(name: string, password: string, role: string): Promise<IUser> {
        return await Users.create({ name, password, role });
    }

    async getUsers(): Promise<IUser[]> {
        return await Users.find();
    }

    async findByName(name: string): Promise<IUser | null> {
        return await Users.findOne({ name });
    }

    async getUserById(id: string): Promise<IUser | null> {
        return await Users.findById(id);
    }

    async updateUser(id: string, name: string, password: string, role: string): Promise<IUser | null> {
        return await Users.findByIdAndUpdate(id, { name, password, role }, { new: true });
    }

    async deleteUser(id: string): Promise<IUser | null> {
        return await Users.findByIdAndDelete(id);
    }

}