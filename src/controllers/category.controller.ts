import { Request, Response } from 'express';
import { ICategory } from '../interface';
import { CategoryServices } from '../services';

const service = new CategoryServices();

const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        // const Categories: ICategory[] | string = await service.getCategories();
        // res.status(200).json(Categories)
        // Parse query parameters
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const searchQuery = req.query.search as string;
        const categoryName = req.query.filter as string;

        // Get categories based on pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        let categories: ICategory[] | string = await service.getCategories();

        // Apply search filter
        if (searchQuery) {
            if (typeof categories === 'string') {
                categories = [];
            } else {
                categories = categories.filter(category =>
                    category.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
        }

        // Apply filtering based on category name
        if (categoryName) {
            if (typeof categories === 'string') {
                // Handle the case where categories is a string (e.g., error message)
                // In this case, no filtering is possible
                categories = [];
            } else {
                categories = (categories as ICategory[]).filter(category =>
                    category.name.toLowerCase() === categoryName.toLowerCase()
                );
            }
        }

        // Get subset of categories based on pagination
        const paginatedCategories = categories.slice(startIndex, endIndex);

        res.status(200).json({
            totalCategories: categories.length,
            currentPage: page,
            categories: paginatedCategories
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

const getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const Category: ICategory | string = await service.getCategoryById(id);
        res.status(200).json(Category)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

const addCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        const Category: ICategory | string = await service.addCategory(name);
        res.status(200).json(Category)
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const Category: ICategory | string = await service.updateCategory(id, name);
        // const updatedCategory = await Categorys.findById(id);
        res.status(200).json(Category);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const Category: string | undefined = await service.deleteCategory(id);
        res.status(200).json(Category);
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export {
    getCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory
}