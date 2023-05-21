const chai = require('chai')
const chaiHttp = require('chai-http')
const TbxApiInterceptor = require('./utils/tbx-api-interceptor')
const createApp = require('../src/app')
const config = require('../src/config')

chai.use(chaiHttp)
chai.should()

class RouteError {
  static fromResponseError (error) {
    const originalData = JSON.parse(error.text)
    const reconstructedError = new Error(originalData.error[0])
    reconstructedError._stack = originalData.error.join('\n')

    Object.defineProperty(reconstructedError, 'stack', {
      get: () => reconstructedError._stack
    })

    return reconstructedError
  }
}

describe('Routes', function () {
  const app = createApp()
  const interceptor = new TbxApiInterceptor(config.tbxApiUrl)

  beforeEach(function () {
    interceptor.reset()
  })

  function configReqs (defaultEndpoint) {
    const req = (endpoint = defaultEndpoint) => chai.request(app).get(endpoint)

    // throw original error on failed request so the test can fail early with useful info
    async function req200 (endpoint = defaultEndpoint) {
      const res = await req(endpoint)

      if (res.error) {
        throw RouteError.fromResponseError(res.error)
      }

      res.should.have.status(200)

      return res
    }

    return { req, req200 }
  }

  describe('/files/data', function () {
    const { req, req200 } = configReqs('/files/data')

    it('should respond json on success', async function () {
      const res = await req200()

      res.should.be.json // eslint-disable-line no-unused-expressions
    })

    it('should respond json on failure', async function () {
      interceptor.setListStatusCode(503)

      const res = await req()

      res.should.have.status(500)
      res.should.be.json // eslint-disable-line no-unused-expressions
    })

    it('should respond ok, with no data when there are no files available', async function () {
      const res = await req200()

      res.body.should.be.an('array').of.length(0)
    })

    it('should respond ok, with no data when files are empty', async function () {
      interceptor.setFile('1.csv')

      const res = await req200()

      res.body.should.be.an('array').of.length(0)
    })

    it('should discard the header from a file', async function () {
      interceptor.setFile('1.csv', ['file,text,number,hex'])

      const res = await req200()

      res.body.should.be.an('array').of.length(0)
    })

    it('should accept entries from a file', async function () {
      interceptor.setFile('1.csv', [
        'file,text,number,hex',
        '1.csv,asd,123,1234567890a1234567890b1234567890'
      ])

      const res = await req200()

      res.body.should.deep.equal([
        {
          file: '1.csv',
          lines: [
            {
              text: 'asd',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        }
      ])
    })

    it('should accept entries from multiple files', async function () {
      interceptor.setFile('1.csv', [
        'file,text,number,hex',
        '1.csv,asd,123,1234567890a1234567890b1234567890'
      ])
      interceptor.setFile('2.csv', [
        'file,text,number,hex',
        '2.csv,qwe,234,123b123b123b123b123b123b123b123b'
      ])

      const res = await req200()

      res.body.should.deep.equal([
        {
          file: '1.csv',
          lines: [
            {
              text: 'asd',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        },
        {
          file: '2.csv',
          lines: [
            {
              text: 'qwe',
              number: 234,
              hex: '123b123b123b123b123b123b123b123b'
            }
          ]
        }
      ])
    })

    it('should accept multiple entries from the same file', async function () {
      interceptor.setFile('1.csv', [
        'file,text,number,hex',
        '1.csv,asd,123,1234567890a1234567890b1234567890',
        '1.csv,qwe,234,123b123b123b123b123b123b123b123b'
      ])

      const res = await req200()

      res.body.should.deep.equal([
        {
          file: '1.csv',
          lines: [
            {
              text: 'asd',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            },
            {
              text: 'qwe',
              number: 234,
              hex: '123b123b123b123b123b123b123b123b'
            }
          ]
        }
      ])
    })

    it('should discard empty files while accepting entries from other files', async function () {
      interceptor.setFile('1.csv')
      interceptor.setFile('2.csv', [
        'file,text,number,hex',
        '2.csv,asd,123,1234567890a1234567890b1234567890'
      ])

      const res = await req200()

      res.body.should.deep.equal([
        {
          file: '2.csv',
          lines: [
            {
              text: 'asd',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        }
      ])
    })

    it('should discard invalid numbers', async function () {
      interceptor.setFile('1.csv', [
        'file,text,number,hex',
        '1.csv,asd,123,1234567890a1234567890b1234567890',
        '1.csv,qwe,234h,1234567890a1234567890b1234567890',
        '1.csv,zxc,3-45,1234567890a1234567890b1234567890'
      ])

      const res = await req200()

      res.body.should.deep.equal([
        {
          file: '1.csv',
          lines: [
            {
              text: 'asd',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        }
      ])
    })

    it('should discard empty numbers', async function () {
      interceptor.setFile('1.csv', [
        'file,text,number,hex',
        '1.csv,asd,,1234567890a1234567890b1234567890'
      ])

      const res = await req200()

      res.body.should.be.an('array').of.length(0)
    })

    it('should discard hexes with invalid characters', async function () {
      interceptor.setFile('1.csv', [
        'file,text,number,hex',
        '1.csv,asd,123,1234567890a1234567890b1234567890',
        '1.csv,qwe,234,o666o666o666o666o666o666o666o666',
        '1.csv,qwe,345,-0000000000000000000000000000000'
      ])

      const res = await req200()

      res.body.should.deep.equal([
        {
          file: '1.csv',
          lines: [
            {
              text: 'asd',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        }
      ])
    })

    it('should discard hexes with invalid length', async function () {
      interceptor.setFile('1.csv', [
        'file,text,number,hex',
        '1.csv,asd,123,1234567890a1234567890b1234567890',
        '1.csv,qwe,234,1234567890a1234567890b123456789',
        '1.csv,qwe,345,1234567890a1234567890b12345678900'
      ])

      const res = await req200()

      res.body.should.deep.equal([
        {
          file: '1.csv',
          lines: [
            {
              text: 'asd',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        }
      ])
    })

    it('should accept empty texts', async function () {
      interceptor.setFile('1.csv', [
        'file,text,number,hex',
        '1.csv,,123,1234567890a1234567890b1234567890'
      ])

      const res = await req200()

      res.body.should.deep.equal([
        {
          file: '1.csv',
          lines: [
            {
              text: '',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        }
      ])
    })

    it('should accept numbers of arbitrary length', async function () {
      interceptor.setFile('1.csv', [
        'file,text,number,hex',
        '1.csv,,1234566789012345678901,1234567890a1234567890b1234567890',
        '1.csv,,12345667890123456789012345678901234567890,1234567890a1234567890b1234567890'
      ])

      const res = await req200()
      const nAsString1 = JSON.stringify(res.body[0].lines[0].number)
      const nAsString2 = JSON.stringify(res.body[0].lines[1].number)

      nAsString1.should.equal('1.2345667890123456e+21')
      nAsString2.should.equal('1.2345667890123457e+40')
    })

    it('should discard files without a header', async function () {
      interceptor.setFile('1.csv', [
        '1.csv,asd,123,1234567890a1234567890b1234567890'
      ])

      const res = await req200()

      res.body.should.be.an('array').of.length(0)
    })

    it("should respond ok, ignoring content from files that can't be retrieved due to errors", async function () {
      interceptor.setFile('fine1.csv', [
        'file,text,number,hex',
        'fine1.csv,asd,123,1234567890a1234567890b1234567890'
      ])
      interceptor.setFile('404error.csv', [
        'file,text,number,hex',
        '404error.csv,asd,123,1234567890a1234567890b1234567890'
      ], 404)
      interceptor.setFile('500error.csv', [
        'file,text,number,hex',
        '500error.csv,asd,123,1234567890a1234567890b1234567890'
      ], 500)
      interceptor.setFile('503error.csv', [
        'file,text,number,hex',
        '503error.csv,asd,123,1234567890a1234567890b1234567890'
      ], 503)
      interceptor.setFile('fine2.csv', [
        'file,text,number,hex',
        'fine2.csv,asd,123,1234567890a1234567890b1234567890'
      ])

      const res = await req200()

      res.body.should.deep.equal([
        {
          file: 'fine1.csv',
          lines: [
            {
              text: 'asd',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        },
        {
          file: 'fine2.csv',
          lines: [
            {
              text: 'asd',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        }
      ])
    })

    it('should discard lines with fields mismatching the header of fields', async function () {
      interceptor.setFile('fine1.csv', [
        'file,text,number,hex',
        'fine1.csv,asd,123,1234567890a1234567890b1234567890'
      ])
      interceptor.setFile('empty.csv', [
        'file,text,number,hex',
        ''
      ])
      interceptor.setFile('3fields.csv', [
        'file,text,number,hex',
        '3fields.csv,123,1234567890a1234567890b1234567890'
      ])
      interceptor.setFile('5fields.csv', [
        'file,text,number,hex',
        '5fields.csv,asd,123,1234567890a1234567890b1234567890,fifth!'
      ])
      interceptor.setFile('fine2.csv', [
        'file,text,number,hex',
        'fine2.csv,asd,123,1234567890a1234567890b1234567890'
      ])

      const res = await req200()

      res.body.should.deep.equal([
        {
          file: 'fine1.csv',
          lines: [
            {
              text: 'asd',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        },
        {
          file: 'fine2.csv',
          lines: [
            {
              text: 'asd',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        }
      ])
    })

    it('should accept lines with unused extra fields', async function () {
      interceptor.setFile('fine1.csv', [
        'extra,file,text,number,hex',
        ':D,fine1.csv,asd,123,1234567890a1234567890b1234567890'
      ])
      interceptor.setFile('fine2.csv', [
        'file,extra,text,number,hex',
        'fine2.csv,:D,asd,123,1234567890a1234567890b1234567890'
      ])
      interceptor.setFile('fine3.csv', [
        'file,text,extra,number,hex',
        'fine3.csv,asd,:D,123,1234567890a1234567890b1234567890'
      ])
      interceptor.setFile('fine4.csv', [
        'file,text,number,extra,hex',
        'fine4.csv,asd,123,:D,1234567890a1234567890b1234567890'
      ])
      interceptor.setFile('fine5.csv', [
        'file,text,number,hex,extra',
        'fine5.csv,asd,123,1234567890a1234567890b1234567890,:D'
      ])

      const res = await req200()

      res.body.should.deep.equal([
        {
          file: 'fine1.csv',
          lines: [
            {
              text: 'asd',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        },
        {
          file: 'fine2.csv',
          lines: [
            {
              text: 'asd',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        },
        {
          file: 'fine3.csv',
          lines: [
            {
              text: 'asd',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        },
        {
          file: 'fine4.csv',
          lines: [
            {
              text: 'asd',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        },
        {
          file: 'fine5.csv',
          lines: [
            {
              text: 'asd',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        }
      ])
    })

    it('should continue to accept lines after an error is found', async function () {
      interceptor.setFile('test.csv', [
        'file,text,number,hex',
        'bad1,123,1234567890a1234567890b1234567890',
        'test.csv,good1,123,1234567890a1234567890b1234567890',
        'test.csv,bad2,1234567890a1234567890b1234567890',
        'test.csv,good2,123,1234567890a1234567890b1234567890',
        'test.csv,asd,bad3',
        'test.csv,good3,123,1234567890a1234567890b1234567890',
        'test.csv,>:(,123,1234567890a1234567890b1234567890,bad4',
        'test.csv,good4,123,1234567890a1234567890b1234567890'
      ])

      const res = await req200()

      res.body.should.deep.equal([
        {
          file: 'test.csv',
          lines: [
            {
              text: 'good1',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            },
            {
              text: 'good2',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            },
            {
              text: 'good3',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            },
            {
              text: 'good4',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        }
      ])
    })

    it('should return entries for the correct file when filtered by fileName', async function () {
      interceptor.setFile('1.csv', [
        'file,text,number,hex',
        '1.csv,filter,123,1234567890a1234567890b1234567890'
      ])
      interceptor.setFile('2.csv', [
        'file,text,number,hex',
        '2.csv,keep,123,1234567890a1234567890b1234567890'
      ])
      interceptor.setFile('3.csv', [
        'file,text,number,hex',
        '3.csv,filter,123,1234567890a1234567890b1234567890'
      ])

      const res = await req200('/files/data?fileName=2.csv')

      res.body.should.deep.equal([
        {
          file: '2.csv',
          lines: [
            {
              text: 'keep',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        }
      ])
    })

    it('should return no entries when filtered by inexistant fileName', async function () {
      interceptor.setFile('1.csv', [
        'file,text,number,hex',
        '1.csv,filter,123,1234567890a1234567890b1234567890'
      ])

      const res = await req200('/files/data?fileName=inexistant')

      res.body.should.be.an('array').of.length(0)
    })

    it('should return all entries when filtered by empty fileName', async function () {
      interceptor.setFile('1.csv', [
        'file,text,number,hex',
        '1.csv,keep,123,1234567890a1234567890b1234567890'
      ])
      interceptor.setFile('2.csv', [
        'file,text,number,hex',
        '2.csv,keep,123,1234567890a1234567890b1234567890'
      ])

      const res = await req200('/files/data?fileName=')

      res.body.should.deep.equal([
        {
          file: '1.csv',
          lines: [
            {
              text: 'keep',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        },
        {
          file: '2.csv',
          lines: [
            {
              text: 'keep',
              number: 123,
              hex: '1234567890a1234567890b1234567890'
            }
          ]
        }
      ])
    })
  })

  describe('/files/list', function () {
    const { req, req200 } = configReqs('/files/list')

    it('should respond json on success', async function () {
      const res = await req200()

      res.should.be.json // eslint-disable-line no-unused-expressions
    })

    it('should respond json on failure', async function () {
      interceptor.setListStatusCode(503)

      const res = await req()

      res.should.have.status(500)
      res.should.be.json // eslint-disable-line no-unused-expressions
    })

    it('should respond ok, with the list of files', async function () {
      interceptor.setFile('1.csv', [
        'file,text,number,hex',
        '1.csv,keep,123,1234567890a1234567890b1234567890'
      ])
      interceptor.setFile('2.csv', [
        'file,text,number,hex',
        '2.csv,keep,123,1234567890a1234567890b1234567890'
      ])

      const res = await req200()

      res.body.should.deep.equal(['1.csv', '2.csv'])
    })

    it('should respond ok, with an empty list when there are no files available', async function () {
      const res = await req200()

      res.body.should.be.an('array').of.length(0)
    })
  })
})
