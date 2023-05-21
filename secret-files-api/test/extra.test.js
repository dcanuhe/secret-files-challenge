const chai = require('chai')
const chaiHttp = require('chai-http')
const createApp = require('../src/app')

chai.use(chaiHttp)
chai.should()

describe('App', function () {
  const app = createApp()

  it('should not find inexistant routes', async function () {
    const res = await chai.request(app).get('/inexistant')
    res.should.have.status(404)
  })

  it('should respond json to inexistant routes', async function () {
    const res = await chai.request(app).get('/inexistant')
    res.should.be.json // eslint-disable-line no-unused-expressions
  })
})
