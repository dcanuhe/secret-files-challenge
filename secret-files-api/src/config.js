module.exports = {
  port: process.env.PORT || 3000,
  tbxApiUrl: process.env.TBX_API_URL || 'https://echo-serv.tbxnet.com',
  tbxApiKey: process.env.TBX_API_KEY || 'aSuperSecretKey' // TODO: hide
}
