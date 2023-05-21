const { parse } = require('csv-parse/sync')
const TbxApiClient = require('./tbx-api-client')

class FilesService {
  constructor () {
    this.tbxApi = new TbxApiClient()
  }

  async getEntries ({ filters }) {
    const fileNames = filters?.fileName ? [filters.fileName] : await this.tbxApi.getFileNames()
    const filesContents = await Promise.all(fileNames.map(this.#fileNameToContent))
    return filesContents.map(this.#toCsvLines).flat()
      .filter(this.#isValidEntry)
      .map(this.#formatEntry)
      .sort(this.#sortByFile)
      .reduce(this.#groupSortedByFile, [])
  }

  /*
  * Dowload the content of a file based on its name.
  * If there's an error dowloading the file, treat
  * it as an empty file
  *
  * Params:
  *   - fileName: (Array) the name of the file
  * Returns: the content of the file if all goes well or
  *   an empty string if there's an error
  */
  #fileNameToContent = async fileName => this.tbxApi.getFileContent(fileName).catch(e => '')

  #toCsvLines = text => parse(text, { columns: true, skip_records_with_error: true })

  #isValidEntry = entry =>
    !!entry.number.match(/^[0-9]+(\.[0-9]+)?$/) &&
    !!entry.hex.match(/^[0-9a-f]{32}$/i)

  #formatEntry = ({ file, text, number, hex, ...others }) => ({ file, text, number: +number, hex })

  #sortByFile = (a, b) => b.file - a.file

  #groupSortedByFile = (grouped, current) => {
    const { file, ...others } = current

    // `grouped` is sorted so if its last elem's file isn't the one
    // we want (different or inexistant), then it's safe to add it.
    if (grouped.length === 0 || grouped[grouped.length - 1].file !== file) {
      grouped.push({ file, lines: [] })
    }

    // at this point, the last element is guaranteed to exist
    grouped[grouped.length - 1].lines.push(others)

    return grouped
  }

  async getFileNames () {
    return this.tbxApi.getFileNames()
  }
}

module.exports = new FilesService()
