const net = require('net')
const fetch = require('like-fetch')
const { HttpsProxyAgent } = require('https-proxy-agent')

const TARGET_URL = 'https://checkip.amazonaws.com'

module.exports = async function connectivityCheck (opts = {}) {
  const target = opts.target || TARGET_URL
  const agent = opts.agent || (opts.proxy ? new HttpsProxyAgent(opts.proxy) : null)

  try {
    const body = await fetch(target, {
      timeout: 10000,
      retry: { max: 3 },
      validateStatus: 200,
      responseType: 'text',
      agent
    })

    const address = body.trim()

    if (net.isIP(address) === 0) {
      throw CCError.CONNECTIVITY_CHECK_FAILED('Invalid IP address')
    }

    return address
  } catch (err) {
    if (err.code === 'ENOTFOUND') throw CCError.CONNECTIVITY_CHECK_OFFLINE()
    if (err.name === 'TimeoutError') throw CCError.CONNECTIVITY_CHECK_TIMEOUT()

    if (err.code === 'ERR_BAD_REQUEST') {
      if (err.response.status === 402) throw CCError.CONNECTIVITY_CHECK_PAYMENT_REQUIRED()
      if (err.response.status === 407) throw CCError.CONNECTIVITY_CHECK_AUTH_REQUIRED()
    }

    throw err
  }
}

class CCError extends Error {
  constructor (msg, code) {
    super(code + ': ' + msg)

    this.code = code
  }

  get name () {
    return 'ConnectivityCheckError'
  }

  static CONNECTIVITY_CHECK_FAILED (msg) {
    return new CCError(msg, 'CONNECTIVITY_CHECK_FAILED')
  }

  static CONNECTIVITY_CHECK_OFFLINE () {
    return new CCError('No network connection', 'CONNECTIVITY_CHECK_OFFLINE')
  }

  static CONNECTIVITY_CHECK_TIMEOUT () {
    return new CCError('Timeout', 'CONNECTIVITY_CHECK_TIMEOUT')
  }

  static CONNECTIVITY_CHECK_PAYMENT_REQUIRED () {
    return new CCError('Payment required', 'CONNECTIVITY_CHECK_PAYMENT_REQUIRED')
  }

  static CONNECTIVITY_CHECK_AUTH_REQUIRED () {
    return new CCError('Auth required', 'CONNECTIVITY_CHECK_AUTH_REQUIRED')
  }
}
