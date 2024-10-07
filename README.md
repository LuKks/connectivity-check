# connectivity-check

Check if the internet connection is online, with proxy support

```
npm i connectivity-check
```

## Usage

```js
const connectivityCheck = require('connectivity-check')

const address = await connectivityCheck()

const proxyAddress = await connectivityCheck({ proxy: 'http://...' })
```

## API

#### `const address = await connectivityCheck([options])`

Returns its public IP address.

Available options:

```js
{
  target: 'https://checkip.amazonaws.com',
  agent: null, // Agent option has priority over proxy
  proxy: null // Upstream URL
}
```

List of error codes:

- `CONNECTIVITY_CHECK_FAILED` Generic error
- `CONNECTIVITY_CHECK_OFFLINE` No network connection
- `CONNECTIVITY_CHECK_TIMEOUT` Request timed out
- `CONNECTIVITY_CHECK_PAYMENT_REQUIRED` Proxy service demands payment
- `CONNECTIVITY_CHECK_AUTH_REQUIRED` Invalid credentials

## License

MIT
