function handleNotFound (req, res, next) {
  res.status(404).json(errorResponse(
    'NOT_FOUND',
    'Not Found',
    new Error(`Cannot ${req.method} ${req.path}`)
  ))
}

function handleError (err, req, res, next) {
  res.status(500).json(errorResponse('ERROR', 'Internal Server Error', err))
}

function errorResponse (code, productionMessage, error) {
  return {
    code,
    error: process.env.NODE_ENV === 'production' ? productionMessage : error.stack.split('\n')
  }
}

module.exports = {
  handleNotFound,
  handleError
}
