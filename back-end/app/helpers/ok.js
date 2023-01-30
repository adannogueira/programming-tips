module.exports.ok = (response) => ({
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Origin': '*'
  },
  statusCode: 200,
  body: JSON.stringify(response)
})