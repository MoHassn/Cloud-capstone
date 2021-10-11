import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getBooksForUser } from '../../helpers/books'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event)
    const books = await getBooksForUser(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: books
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
