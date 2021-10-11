import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateBookRequest } from '../../requests/CreateBookRequest'
import { getUserId } from '../utils'
import { createBook } from '../../helpers/books'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newBook: CreateBookRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const book = await createBook(newBook, userId)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: book
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
