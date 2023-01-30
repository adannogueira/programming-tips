const { ok } = require('./helpers/ok')
const { serverError } = require('./helpers/serverError')
const AWS = require("aws-sdk")
const crypto = require('crypto')

const USERS_TABLE = process.env.USERS_TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.addSubscriber = async (event) => {
  const body = JSON.parse(event.body)
  if (!body.email) return serverError('Invalid email data')
  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: crypto.randomUUID(),
      email: body.email,
      subscriber: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
  const result = await dynamoDb.put(params).promise()
  return result.$response.error
    ? serverError(result.$response.error)
    : ok()
}
