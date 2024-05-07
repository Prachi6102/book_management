import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUser } from "../interface";
import { UserQueries } from "../queries";
const blacklistedTokens: string[] = [];

dotenv.config();

const SECRET_KEY: string = process.env.SECRET_KEY || '';

const userQueries = new UserQueries();

export class UserServices {
    async getUsers(): Promise<IUser[] | string> {
        const Users = await userQueries.getUsers();
        if (Users.length == 0) {
            return "No users found!!"
        } else {
            return Users;
        }
    }

    async getUserById(id: string): Promise<IUser | string> {
        const User = await userQueries.getUserById(id);
        if (User) {
            return User;
        } else {
            return "User not found!!"
        }
    }

    async addUser(name: string, password: string, role: string): Promise<IUser | string> {
        //check if user with the same name already exists
        const existingUser: IUser | null = await userQueries.findByName(name);
        if (existingUser) {
            return "User with this name already exists!!";
        } else {
            //hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            password = hashedPassword;
            const user: IUser = await userQueries.createUser(name, password, role);
            return user;
        }
    }

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

    async updateUser(id: string, name: string, password: string, role: string): Promise<IUser | string> {
        const existingUser: IUser | null = await userQueries.getUserById(id);
        if (!existingUser) {
            return "User not found!";
        } else {
            let updatedName = existingUser.name;
            let updatedPassword = existingUser.password;

            if (name !== existingUser.name) {
                // Check if the new name is already taken
                const existingNameUser: IUser | null = await userQueries.findByName(name);
                if (existingNameUser) {
                    return "Username already exists!";
                }
                updatedName = name;
            }

            if (password) {
                const saltRounds = 10;
                updatedPassword = await bcrypt.hash(password, saltRounds);
            }

            const updatedUser: IUser | null = await userQueries.updateUser(id, updatedName, updatedPassword, role);
            if (!updatedUser) {
                return "Failed to update user!";
            } else {
                return updatedUser;
            }
        }
    }


    async deleteUser(id: string): Promise<string | undefined> {
        const deletedUser = await userQueries.deleteUser(id);
        if (!deletedUser) {
            return "User not found!";
        } else {
            return "User deleted successfully!";
        }
    }

    async loginUser(name: string, password: string, role: string): Promise<string> {
        const user: IUser | null = await userQueries.findByName(name);
        if (!user) {
            return "User not found!";
        }

        //compare the hashed password from the database with the plaintext password
        const passwordMatch: boolean = await bcrypt.compare(password, user.password as string);
        if (!passwordMatch) {
            return "Invalid password";
        } else if (user.role !== role) {
            return "No user found with this role.";
        } else {
            const userPayload: JwtPayload = {
                name: user.name,
                u_id: user._id,
                role: user.role
            };
            const token = jwt.sign(userPayload, SECRET_KEY, { expiresIn: '12h' });
            // localStorage.setItem('token', token);
            console.log("User Token : ", token);
            // res.json({ token })
            return "Login Successful!";
        }
    }

    // async logoutUser(): Promise<string> {
    //     localStorage.removeItem('token');
    //     return "User logged out successfully!!"
    // }
}