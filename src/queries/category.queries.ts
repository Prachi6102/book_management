import { DeleteResult } from 'mongodb'
import { ICategory, IBook } from '../interface'
import { Categories, Books } from '../models'

export class CategoryQueries {
  async createCategory(name: string): Promise<ICategory> {
    return await Categories.create({ name })
  }

  async getCategories(): Promise<ICategory[]> {
    return await Categories.find()
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    return await Categories.findById(id)
  }

  async updateCategory(id: string, name: string): Promise<ICategory | null> {
    return await Categories.findByIdAndUpdate(id, { name }, { new: true })
  }

  async deleteCategory(id: string): Promise<ICategory | null> {
    return await Categories.findByIdAndDelete(id)
  }

  async checkCategory(name: string): Promise<ICategory | null> {
    return await Categories.findOne({ name: name })
  }

  async session() {
    return await Categories.startSession()
  }

  async getBooksByAuthor(id: string): Promise<IBook[] | null> {
    return await Books.find({ author: id })
  }

  async deleteBook(id: string): Promise<DeleteResult> {
    return await Books.deleteOne({ author: id })
  }
}
