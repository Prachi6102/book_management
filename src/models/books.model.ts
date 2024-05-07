import mongoose, { Model, Schema } from 'mongoose';
import { IBook } from '../interface'

const BookSchema: Schema<IBook> = new Schema<IBook>(
    {
        title: {
            type: String,
            required: true
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'authors',
            required: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'categories',
            required: true
        },

        ISBN: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Books: Model<IBook> = mongoose.model<IBook>('Books', BookSchema);

export { Books }

