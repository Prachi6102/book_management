import mongoose, { Model, Schema } from 'mongoose';
import { ICategory } from '../interface';

const CategorySchema: Schema<ICategory> = new Schema<ICategory>(
    {
        name: {
            type: String,
            enum: ['Fiction', 'Non-Fiction', 'Romance', 'Thriller', 'Poetry', 'Short Strories', 'Magical Realism'],
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Categories: Model<ICategory> = mongoose.model<ICategory>('Categories', CategorySchema);

export { Categories }

