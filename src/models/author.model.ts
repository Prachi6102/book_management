import mongoose, { Model, Schema } from 'mongoose';
import { IAuthor } from '../interface'

const AuthorSchema: Schema<IAuthor> = new Schema<IAuthor>(
    {
        name: {
            type: String,
            required: [true, "Please enter user name!"]
        },

        biography: {
            type: String,
            required: true
        },

        nationality: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Authors: Model<IAuthor> = mongoose.model<IAuthor>('Authors', AuthorSchema);

export { Authors }

