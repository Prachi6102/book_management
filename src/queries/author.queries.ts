import { DeleteResult } from "mongodb";
import { IAuthor, IBook } from "../interface";
import { Authors, Books } from "../models";

export class AuthorQueries {
    async createAuthor(name: string, biography: string, nationality: string): Promise<IAuthor> {
        return await Authors.create({ name, biography, nationality });
    }

    async getAuthors(): Promise<IAuthor[]> {
        return await Authors.find();
    }

    async findByName(name: string): Promise<IAuthor | null> {
        return await Authors.findOne({ name });
    }

    async getAuthorById(id: string): Promise<IAuthor | null> {
        return await Authors.findById(id);
    }

    async updateAuthor(id: string, name: string, biography: string, nationality: string): Promise<IAuthor | null> {
        return await Authors.findByIdAndUpdate(id, { name, biography, nationality }, { new: true });
    }

    async deleteAuthor(id: string): Promise<IAuthor | null> {
        return await Authors.findByIdAndDelete(id);
    }

    async session() {
        return await Authors.startSession();
    }

    async getBooksByAuthor(id: string): Promise<IBook[] | null> {
        return await Books.find({ author: id });
    }

    async deleteBook(id: string): Promise<DeleteResult> {
        return await Books.deleteOne({ author: id });
    }
}