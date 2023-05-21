const express = require('express')
const cors = require('cors')
const filesRouter = require('./routes/files')
const docsRouter = require('./routes/docs')

module.exports = function createApp () {
  const app = express()

  app.use(cors())

  app.use('/files', filesRouter)
  app.use('/docs', docsRouter)

  app.use(handleNotFound)
  app.use(handleError)

  return app
}

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
