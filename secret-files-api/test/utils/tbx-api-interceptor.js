const nock = require('nock')

// TODO: read from api client
const FILES_LIST_ENDPOINT = '/v1/secret/files'
const FILE_ENDPOINT = '/v1/secret/file'

class TbxApiInterceptor {
  constructor (apiUrl) {
    this.apiUrl = apiUrl
    this.reset()
  }

  setDefaultData () {
    this.data = {
      list: {
        statusCode: 200
      },
      files: {}
    }
  }

  setListStatusCode (statusCode) {
    this.data.list.statusCode = statusCode
  }

  setFile (fileName, lines = [], statusCode = 200) {
    this.data.files[fileName] = { statusCode, content: lines.join('\n') }
  }

  getFileNames () {
    return Object.entries(this.data.files).map(([fileName, fileData]) => fileName)
  }

  reset () {
    nock.cleanAll()
    this.setDefaultData()

    const fileEndpointMatcher = new RegExp(`${FILE_ENDPOINT}/([^/]+)$`)

    nock(this.apiUrl)
      .persist()
      .get(FILES_LIST_ENDPOINT)
      .reply((uri, requestBody) => [this.data.list.statusCode, { files: this.getFileNames() }])
      .get(fileEndpointMatcher)
      .reply((uri, requestBody) => {
        const fileName = uri.match(fileEndpointMatcher)[1]
        const fileData = this.data.files[fileName]
        return [fileData ? fileData.statusCode : 404, fileData?.content]
      })
  }
}

module.exports = TbxApiInterceptor
