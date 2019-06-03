# LIFX Controller
WebSockets-based LIFX Controller software.

For an example use case, look at [`./app.js`](app.js).

## Installation

### `npm`
```sh
npm i
```

### `yarn`
```sh
yarn
```

## Custom Configuration

### WebSocket Server
To configure the Webpack listener, you have 3 options available to modify in your `./localConfig.js`:

module.exports = {
	// ... other config options ...
	hostname,
	port,
	protocol,
}

### LIFX HTTP API Token
Go to [LIFX's cloud settings page](https://cloud.lifx.com/settings) and create a new token for your app. This will go in your `./localConfig.js` as:

```js
module.exports = {
	// ... other config options ...
	lifxApiToken: 'YOUR_LIFX_API_TOKEN',
}
```

### Custom Options to node-lifx
In `./projectConfig.js` or `./localConfig.js`, add a property `nodeLifxClient` as an object and its options as properties on that object.

```js
module.exports = {
	nodeLifxClient: {
		debug: true,
		messageHandlerTimeout: 2000,
		resendMaxTimes: 3,
	},
}
```

## Testing

### Toggle Group
To test toggling a group, load up a browser, and go to `about:blank`.

Then paste this into the devtools console:
```js
webSocket = new WebSocket('ws://localhost:3000', 'v1')
webSocket.onmessage = console.log
webSocket.onerror = console.error
webSocket.onclose = console.info
webSocket.onopen = () => {
	console.log('READY')
	
	webSocket
	.send(
		JSON
		.stringify({
			groupName: 'Dining Room',
			type: 'REQUEST::TOGGLE_GROUP',
		})
	)
}
```
