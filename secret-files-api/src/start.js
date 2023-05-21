const createApp = require('./app')
const { port } = require('./config')

const app = createApp()

app.listen(port, () => {
  console.log(`Secret Files API listening on port ${port}`)
})
