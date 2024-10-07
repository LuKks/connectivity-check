const test = require('brittle')
const net = require('net')
const { HttpsProxyAgent } = require('https-proxy-agent')
const dotenv = require('dotenv')
const connectivityCheck = require('./index.js')

dotenv.config()

test('basic', async function (t) {
  const proxy = makeUpstream('us')

  const originAddress = await connectivityCheck()
  const proxyAddress = await connectivityCheck({ proxy })

  t.not(originAddress, proxyAddress)

  t.ok(net.isIP(originAddress) !== 0)
  t.ok(net.isIP(proxyAddress) !== 0)
})

test('with agent', async function (t) {
  const agent = new HttpsProxyAgent(makeUpstream('us'))

  const originAddress = await connectivityCheck()
  const proxyAddress = await connectivityCheck({ agent })

  t.not(originAddress, proxyAddress)

  t.ok(net.isIP(originAddress) !== 0)
  t.ok(net.isIP(proxyAddress) !== 0)
})

function makeUpstream (country) {
  const proto = process.env.PROXY_PROTOCOL
  const host = process.env.PROXY_HOST
  const port = process.env.PROXY_PORT
  const user = process.env.PROXY_USERNAME
  const pass = process.env.PROXY_PASSWORD + '_country-' + country

  return proto + '://' + user + ':' + pass + '@' + host + ':' + port
}
