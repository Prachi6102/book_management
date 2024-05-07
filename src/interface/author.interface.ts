import { Document } from 'mongoose';

export interface IAuthor extends Document {
    name: string;
    biography: string;
    nationality: string;
}