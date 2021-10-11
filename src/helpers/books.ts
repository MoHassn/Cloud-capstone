import { BooksAccess } from './booksAccess'
import { AttachmentUtils } from './attachmentUtils'
import { Book } from '../models/Book'
import { CreateBookRequest } from '../requests/CreateBookRequest'
import { UpdateBookRequest } from '../requests/UpdateBookRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('Books')

const booksAccess = new BooksAccess()

const attachmentUtils = new AttachmentUtils()

export async function getBooksForUser(userId: string): Promise<Book[]> {
  logger.log({
    level: 'info',
    message: 'Getting Books'
  })
  return booksAccess.getAllBooks(userId)
}

export async function createBook(
  createBookRequest: CreateBookRequest,
  userId: string
): Promise<Book> {
  logger.log({
    level: 'info',
    message: 'Creating Book'
  })
  const bookId = uuid.v4()
  const book = {
    bookId,
    userId,
    title: createBookRequest.title,
    author: createBookRequest.author,
    rating: createBookRequest.rating
  }

  return booksAccess.createBook(book)
}

export async function updateBook(
  updateBookRequest: UpdateBookRequest,
  bookId: string,
  userId: string
): Promise<void> {
  logger.log({
    level: 'info',
    message: 'Updating Book'
  })
  return booksAccess.updateBook(bookId, userId, updateBookRequest)
}

export async function deleteBook(
  bookId: string,
  userId: string
): Promise<void> {
  return booksAccess.deleteBook(bookId, userId)
}

export async function createAttachmentPresignedUrl(
  bookId: string,
  userId: string
): Promise<string> {
  await booksAccess.updateBookUrl(bookId, userId)

  return attachmentUtils.generatePresignedUrl(bookId)
}
