module.exports.serverError = (response) => ({
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*'
  },
  statusCode: 500,
  body: JSON.stringify(response)
})