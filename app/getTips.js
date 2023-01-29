const AWS = require("aws-sdk")
const { ok } = require('./helpers/ok')
AWS.config.update({ region: process.env.REGION })
const s3 = new AWS.S3()

module.exports.getTips = async (event) => {
  const tips = await s3.getObject({
    Bucket: 'programming-tips',
    Key: 'tips.json'
  }).promise()
  const parsedResult = JSON.parse(tips.Body)
  return ok(parsedResult)
}
