const axios = require('axios')
const config = require('../../config')

const FILES_LIST_ENDPOINT = '/v1/secret/files'
const FILE_ENDPOINT = '/v1/secret/file'

class TbxApiClient {
  constructor () {
    this.tbxApiUrl = config.tbxApiUrl
    this.tbxApiKey = config.tbxApiKey
  }

  async makeRequest (endpoint) {
    return await axios.get(endpoint, {
      baseURL: this.tbxApiUrl,
      headers: {
        Authorization: `Bearer ${this.tbxApiKey}`
      }
    })
  }

  async getFileNames () {
    const res = await this.makeRequest(FILES_LIST_ENDPOINT)
    return res.data.files
  }

  async getFileContent (fileName) {
    const res = await this.makeRequest(`${FILE_ENDPOINT}/${fileName}`)
    return res.data
  }
}

module.exports = TbxApiClient
