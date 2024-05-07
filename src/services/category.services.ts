import { ICategory } from '../interface';
import { CategoryQueries } from '../queries';

const queries = new CategoryQueries();

export class CategoryServices {
    async getCategories(): Promise<ICategory[] | string> {
        const Categories = await queries.getCategories();
        if (Categories.length == 0) {
            return "No Categorys are added yet!!"
        } else {
            return Categories;
        }
    }

    async getCategoryById(id: string): Promise<ICategory | string> {
        const Category = await queries.getCategoryById(id);
        if (Category) {
            return Category;
        } else {
            return "Category not found!!"
        }
    }

    async addCategory(name: string): Promise<ICategory | string> {
        const existingCategory = await queries.checkCategory(name);
        if (existingCategory) {
            return "Category already exists!!"
        }
        return await queries.createCategory(name);
    }

    async updateCategory(id: string, name: string): Promise<ICategory | string> {
        const existingCategory = await queries.checkCategory(name);
        if (existingCategory) {
            return "Category already exists!!"
        }
        const updatedCategory = await queries.updateCategory(id, name);
        if (!updatedCategory) {
            return "Category not found!!"
        } else {
            return updatedCategory;
        }
    }

    // async deleteCategory(id: string): Promise<string> {
    //     const deletedCategory = await queries.deleteCategory(id);
    //     if (!deletedCategory) {
    //         return "Category not found!!"
    //     } else {
    //         return "Category deleted successfully";
    //     }
    // }

    async deleteCategory(id: string): Promise<string | undefined> {
        let session;
        try {
            session = await queries.session();
            session.startTransaction();
            const category = await queries.getCategoryById(id);

            if (!category) {
                return "Category not found!";
            }

            const books = await queries.getBooksByAuthor(id);

            if (!books) {
                return "Books not found!";
            }

            for (const book of books) {
                await queries.deleteBook(book._id);
            }

            await session.commitTransaction();
            session.endSession();

            return "Category and associated books deleted successfully!";
        } catch (error: any) {
            if (session) {
                await session.abortTransaction();
                session.endSession();
                console.error("Error deleting category and associated books:", error);
                return "An error occurred while deleting category and associated books.";
            }
        }
    }
}