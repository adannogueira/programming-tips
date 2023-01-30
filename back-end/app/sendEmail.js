const { ok } = require('./helpers/ok')
const { serverError } = require('./helpers/serverError')
const AWS = require('aws-sdk')
const sendgrid = require('@sendgrid/mail')
const axios = require('axios').default

sendgrid.setApiKey(process.env.SENDGRID_KEY)

module.exports.sendEmail = async (event) => {
  try {
    const randomTip = await getTip()
    const emailHTML = createEmailHTML(randomTip)
    const subscriberEmails = await getSubscribers()
    await sendgrid.sendMultiple({
      to: subscriberEmails,
      from: process.env.EMAIL,
      subject: "[Today's Programming Tip]",
      text: "Let's get to the next level 🚀",
      html: emailHTML
    })
    return ok({ message: 'Success' })
  } catch (error) {
    return serverError(error.message)
  }
}

const getTip = async () => {
  const { data } = await axios.get(process.env.TIPS_ENDPOINT)
  return data.tips[Math.floor(Math.random() * data.tips.length)];
}

const createEmailHTML = (randomTip) => `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html lang="en">
    <body>
      <div class="container", style="min-height: 40vh;
        padding: 0 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;"
      > 
        <div class="card" style="margin-left: 20px;margin-right: 20px;">
            <div style="font-size: 14px;">
              <div class='card' style=" background: #f0c5c5;
                border-radius: 5px;
                padding: 1.75rem;
                font-size: 1.1rem;
                font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;"
              >
                <h3>${randomTip.title}</h3>
                <p>${randomTip.tip}</p>
              </div>
              <br>
            </div>
            <div class="footer-links" style="display: flex;justify-content: center;align-items: center;">
              <a href="/" style="text-decoration: none;margin: 8px;color: #9CA3AF;">Unsubscribe?</a>
              <a href="/" style="text-decoration: none;margin: 8px;color: #9CA3AF;">About Us</a>
            </div>
        </div>
      </div>     
    </body>
  </html>
`

const getSubscribers = async () => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient()
  const subscribers = await dynamoDb.scan({
    TableName: process.env.USERS_TABLE,
    ScanFilter: {
      subscriber: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [true]
      }
    }
  }).promise()
  return subscribers.Items.map(subscriber => subscriber.email)
}