import { Request, Response } from "express";
import { IAuthor, AuthenticatedRequest } from "../interface";
import { AuthorServices } from "../services";

const services = new AuthorServices();

const getAuthors = async (req: Request, res: Response): Promise<void> => {
    try {
        // const Authors: IAuthor[] | string = await services.getAuthors();
        // res.status(200).json(Authors)
        // Parse query parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const searchQuery = req.query.search as string;
        const filterCriteria = req.query.filter as string;

        // Get authors based on pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        let authors: IAuthor[] | string = await services.getAuthors();

        // Apply search filter
        if (searchQuery) {
            if (typeof authors === 'string') {
                authors = [];
            } else {
                authors = authors.filter(author =>
                    author.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
        }

        // Filtering based on nationality 
        if (filterCriteria) {
            if (typeof authors === 'string') {
                authors = [];
            } else {
                authors = authors.filter(author =>
                    author.nationality.toLowerCase() === filterCriteria.toLowerCase()
                );
            }
        }

        // Get subset of authors based on pagination
        const paginatedAuthors = (authors as IAuthor[]).slice(startIndex, endIndex);

        res.status(200).json({
            totalAuthors: Array.isArray(authors) ? authors.length : 0,
            currentPage: page,
            authors: paginatedAuthors
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

const getAuthorById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const Author: IAuthor | string = await services.getAuthorById(id);
        res.status(200).json(Author)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

const addAuthor = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, biography, nationality } = req.body;
        const Author: IAuthor | string = await services.addAuthor(name, biography, nationality);
        res.status(200).json(Author)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

const updateAuthor = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, biography, nationality } = req.body;
        const updatedAuthor: IAuthor | string = await services.updateAuthor(id, name, biography, nationality)
        res.status(200).json(updatedAuthor);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

const deleteAuthor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedAuthor: string | undefined = await services.deleteAuthor(id);
        res.status(200).json(deletedAuthor);
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}


export {
    getAuthors,
    getAuthorById,
    addAuthor,
    updateAuthor,
    deleteAuthor
}
