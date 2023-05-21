const express = require('express')
const cors = require('cors')
const { handleError, handleNotFound } = require('./errorHandlers')
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
