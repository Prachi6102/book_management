import mongoose, { Model, Schema } from 'mongoose';
import { IUser } from '../interface'

const UserSchema: Schema<IUser> = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Please enter user name!"]
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Users: Model<IUser> = mongoose.model<IUser>('Users', UserSchema);

export { Users }

