import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IBook } from '../interface';
import { BookServices } from '../services';

const service = new BookServices();

const getBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        // const Books: IBook[] | string = await service.getBooks();
        // res.status(200).json(Books)
        // Parse query parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const searchQuery = req.query.search as string;
        const categoryFilter = req.query.category as string;
        const authorFilter = req.query.author as string;

        // Get books based on pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        let books: IBook[] | string = await service.getBooks();

        // Apply search filter
        if (searchQuery) {
            if (typeof books === 'string') {
                books = [];
            } else {
                books = books.filter(book =>
                    book.title.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
        }

        // Apply category filter
        if (categoryFilter && mongoose.Types.ObjectId.isValid(categoryFilter)) {
            if (typeof books === 'string') {
                books = [];
            } else {
                books = books.filter(book =>
                    book.category.toString() === categoryFilter
                );
            }
        }

        // Apply author filter
        if (authorFilter && mongoose.Types.ObjectId.isValid(authorFilter)) {
            if (typeof books === 'string') {
                books = [];
            } else {
                books = books.filter(book =>
                    book.author.toString() === authorFilter
                );
            }
        }

        // Get subset of books based on pagination
        const paginatedBooks = (books as IBook[]).slice(startIndex, endIndex);

        res.status(200).json({
            totalBooks: Array.isArray(books) ? books.length : 0,
            currentPage: page,
            books: paginatedBooks
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

const getBooksById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const Book: IBook | string = await service.getBookById(id);
        res.status(200).json(Book)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

const addBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, author, category, ISBN, description, price } = req.body;
        const Book: IBook | string = await service.addBook(title, author, category, ISBN, description, price);
        res.status(200).json(Book)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

const updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, author, category, ISBN, description, price } = req.body;
        const Book: IBook | string = await service.updateBook(id, title, author, category, ISBN, description, price);
        // const updatedCategory = await Categorys.findById(id);
        res.status(200).json(Book);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

const deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const Book: IBook | string = await service.deleteBook(id);
        res.status(200).json(Book);
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export {
    getBooks,
    getBooksById,
    addBook,
    updateBook,
    deleteBook
}