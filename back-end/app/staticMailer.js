const { ok } = require('./helpers/ok')
const { serverError } = require('./helpers/serverError')
const AWS = require("aws-sdk")
const axios = require('axios').default
const sns = new AWS.SNS()
const SUBSCRIBE_ENDPOINT = process.env.SUBSCRIBE_ENDPOINT

const publishToSns = async (message) => {
  try {
    await sns
      .publish({
        Message: message,
        TopicArn: process.env.SNS_TOPIC_ARN
      })
      .promise()
  } catch (error) {
    console.error(error)
  }
}

const buildEmailBody = (id, form) => `
  Message: ${form.message}
  Name: ${form.name}
  Email: ${form.email}
  Service Information: ${id.sourceIp} - ${id.userAgent}
`

module.exports.staticMailer = async (event) => {
  const body = JSON.parse(event.body)
  const emailBody = buildEmailBody(event.requestContext.identity, body)
  await publishToSns(emailBody)
  try {
    await axios.post(SUBSCRIBE_ENDPOINT, { email: body.email })
    return ok({ message: 'Success' })
  } catch (error) {
    return serverError(error)
  }
}