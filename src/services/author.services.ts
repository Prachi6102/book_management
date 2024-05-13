import { IAuthor } from '../interface'
import { AuthorQueries } from '../queries'

const queries = new AuthorQueries()

export class AuthorServices {
  async getAuthors(): Promise<IAuthor[] | string> {
    const Authors = await queries.getAuthors()
    if (Authors.length == 0) {
      return 'No authors found!!'
    } else {
      return Authors
    }
  }

  async getAuthorById(id: string): Promise<IAuthor | string> {
    const Author = await queries.getAuthorById(id)
    if (Author) {
      return Author
    } else {
      return 'Author not found!!'
    }
  }

  async addAuthor(
    name: string,
    biography: string,
    nationality: string
  ): Promise<IAuthor | string> {
    //check if author with the same name already exists
    const existingAuthor: IAuthor | null = await queries.findByName(name)
    if (existingAuthor) {
      return 'Author with this name already exists!!'
    } else {
      const author: IAuthor = await queries.createAuthor(
        name,
        biography,
        nationality
      )
      return author
    }
  }

  async updateAuthor(
    id: string,
    name: string,
    biography: string,
    nationality: string
  ): Promise<IAuthor | string> {
    const existingAuthor: IAuthor | null = await queries.getAuthorById(id)
    if (!existingAuthor) {
      return 'Author not found!!'
    } else {
      let updatedName = existingAuthor.name

      if (name !== existingAuthor.name) {
        // Check if the new name is already taken
        const existingNameAuthor: IAuthor | null =
          await queries.findByName(name)
        if (existingNameAuthor) {
          return 'Authorname already exists!'
        }
        updatedName = name
      }
      const updatedAuthor: IAuthor | null = await queries.updateAuthor(
        id,
        updatedName,
        biography,
        nationality
      )
      if (!updatedAuthor) {
        return 'Failed to update author!'
      } else {
        return updatedAuthor
      }
    }
  }

  // async deleteAuthor(id: string): Promise<string | undefined>{
  //     const deletedAuthor = await queries.deleteAuthor(id);
  //     if(!deletedAuthor){
  //         return "Author not found!";
  //     }else{
  //         return "Author deleted successfully!";
  //     }
  // }

  async deleteAuthor(id: string): Promise<string | undefined> {
    let session
    try {
      session = await queries.session()
      session.startTransaction()
      const author = await queries.getAuthorById(id)

      if (!author) {
        return 'Author not found!'
      }

      const books = await queries.getBooksByAuthor(id)

      if (!books) {
        return 'Books not found!'
      }

      for (const book of books) {
        await queries.deleteBook(book._id)
      }

      await session.commitTransaction()
      session.endSession()

      return 'Author and associated books deleted successfully!'
    } catch (error: any) {
      if (session) {
        await session.abortTransaction()
        session.endSession()
        console.error('Error deleting author and associated books:', error)
        return 'An error occurred while deleting author and associated books.'
      }
    }
  }
}
