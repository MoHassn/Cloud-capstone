import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { Book } from '../models/Book'
import { BookUpdate } from '../models/BookUpdate'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('BooksAccess')

const bucketName = process.env.ATTACHMENT_S3_BUCKET

export class BooksAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly booksTable = process.env.BOOKS_TABLE
  ) {}

  async getAllBooks(userId: string): Promise<Book[]> {
    logger.log({
      level: 'info',
      message: 'Getting all Books'
    })

    const result = await this.docClient
      .query({
        TableName: this.booksTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      })
      .promise()

    const items = result.Items
    return items as Book[]
  }

  async createBook(book: Book): Promise<Book> {
    logger.log({
      level: 'info',
      message: 'Creating Book'
    })

    await this.docClient
      .put({
        TableName: this.booksTable,
        Item: book
      })
      .promise()

    return book
  }

  async updateBook(
    bookId: string,
    userId: string,
    bookUpdate: BookUpdate
  ): Promise<void> {
    logger.log({
      level: 'info',
      message: 'Updating Book'
    })
    await this.docClient
      .update({
        TableName: this.booksTable,
        Key: {
          userId: userId,
          bookId: bookId
        },
        UpdateExpression: 'set  title=:t, rating=:r, author=:a',
        ExpressionAttributeValues: {
          ':t': bookUpdate.title,
          ':r': bookUpdate.rating,
          ':a': bookUpdate.author
        },
        ReturnValues: 'NONE'
      })
      .promise()
  }

  async deleteBook(bookId: string, userId: string): Promise<void> {
    logger.log({
      level: 'info',
      message: 'Deleting Book'
    })
    await this.docClient
      .delete({
        TableName: this.booksTable,
        Key: {
          userId: userId,
          bookId: bookId
        }
      })
      .promise()
  }
  async updateBookUrl(bookId: string, userId: string): Promise<void> {
    logger.log({
      level: 'info',
      message: 'Updating Book URL'
    })
    await this.docClient
      .update({
        TableName: this.booksTable,
        Key: {
          userId: userId,
          bookId: bookId
        },
        UpdateExpression: 'set attachmentUrl = :a',
        ExpressionAttributeValues: {
          ':a': `https://${bucketName}.s3.amazonaws.com/${bookId}`
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()
  }
}
