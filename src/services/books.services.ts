import { IBook } from '../interface'
import { BookQueries } from '../queries'

const queries = new BookQueries()

export class BookServices {
  async getBooks(): Promise<IBook[] | string> {
    const Books = await queries.getBooks()
    if (Books.length == 0) {
      return 'No books are added yet!!'
    } else {
      return Books
    }
  }

  async getBookById(id: string): Promise<IBook | string> {
    const Book = await queries.getBookById(id)
    if (Book) {
      return Book
    } else {
      return 'Book not found!!'
    }
  }

  async addBook(
    title: string,
    author: string,
    category: string,
    ISBN: string,
    description: string,
    price: number
  ): Promise<IBook | string> {
    const existingBook = await queries.checkBook(title)
    if (existingBook) {
      return 'Book already exists!!'
    }
    return await queries.addBook(
      title,
      author,
      category,
      ISBN,
      description,
      price
    )
  }

  async updateBook(
    id: string,
    title: string,
    author: string,
    category: string,
    ISBN: string,
    description: string,
    price: number
  ): Promise<IBook | string> {
    const existingBook = await queries.checkBook(title)
    if (existingBook) {
      return 'Book already exists!!'
    }
    const updatedBook = await queries.updateBook(
      id,
      title,
      author,
      category,
      ISBN,
      description,
      price
    )
    if (!updatedBook) {
      return 'Book not found!!'
    } else {
      return updatedBook
    }
  }

  async deleteBook(id: string): Promise<string> {
    const deletedBook = await queries.deleteBook(id)
    if (!deletedBook) {
      return 'Book not found!!'
    } else {
      return 'Book deleted successfully'
    }
  }
}
