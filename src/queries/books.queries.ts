import { IBook } from '../interface'
import { Books } from '../models'

export class BookQueries {
  async addBook(
    title: string,
    author: string,
    category: string,
    ISBN: string,
    description: string,
    price: number
  ): Promise<IBook> {
    return await Books.create({
      title,
      author,
      category,
      ISBN,
      description,
      price
    })
  }

  async getBooks(): Promise<IBook[]> {
    return await Books.find()
  }

  async getBookById(id: string): Promise<IBook | null> {
    return await Books.findById(id)
  }

  async updateBook(
    id: string,
    title: string,
    author: string,
    category: string,
    ISBN: string,
    description: string,
    price: number
  ): Promise<IBook | null> {
    return await Books.findByIdAndUpdate(
      id,
      { title, author, category, ISBN, description, price },
      { new: true }
    )
  }

  async deleteBook(id: string): Promise<IBook | null> {
    return await Books.findByIdAndDelete(id)
  }

  async checkBook(title: string): Promise<IBook | null> {
    return await Books.findOne({ title: title })
  }
}
