const express = require('express')
const path = require('path')
const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')

const router = express.Router()

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: { title: 'Secret Files API', version: '0.1.0' }
  },
  apis: [path.join(__dirname, 'files.js')]
})

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

module.exports = router
