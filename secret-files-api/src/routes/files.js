const expressPromiseRouter = require('express-promise-router')
const filesService = require('../services/files')

const router = expressPromiseRouter()

/**
 * @openapi
 * paths:
 *   /files/data:
 *     get:
 *       tags:
 *         - Files
 *       parameters:
 *         - in: query
 *           name: fileName
 *           description: filter results by file name
 *           required: false
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Ok
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     file:
 *                       type: string
 *                       example: "file.csv"
 *                     lines:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           file:
 *                             type: string
 *                             example: "file.csv"
 *                           text:
 *                             type: string
 *                             example: "asdQWE123+%&"
 *                           number:
 *                             type: number
 *                             example: 123
 *                           hex:
 *                             type: string
 *                             example: "0123456789abcdef0123456789abcdef"
 *         500:
 *           description: An error has ocurred and the data couldn't be retrieved
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: "CRYPTIC_ERROR_123"
 *                   error:
 *                     type: string
 *                     example: "Internal Server Error"
 */
router.get('/data', async (req, res) => {
  const options = { filters: {} }

  if (req.query.fileName) {
    options.filters.fileName = req.query.fileName
  }

  res.json(await filesService.getEntries(options))
})

/**
 * @openapi
 * paths:
 *   /files/list:
 *     get:
 *       tags:
 *         - Files
 *       responses:
 *         200:
 *           description: Ok
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "file1.csv"
 *                 example: ["file1.csv", "file2.csv"]
 *         500:
 *           description: An error has ocurred and the data couldn't be retrieved
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: "CRYPTIC_ERROR_123"
 *                   error:
 *                     type: string
 *                     example: "Internal Server Error"
 */
router.get('/list', async (req, res) => {
  res.json(await filesService.getFileNames())
})

module.exports = router
