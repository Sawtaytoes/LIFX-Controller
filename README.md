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

## Custom Options to node-lifx
In `./projectConfig.js` or `./localConfig.js`, add a property `nodeLifxClient` as an object and its options as properties on that object.

```js
module.exports = {
	nodeLifxClient: {
		debug: true,
		resendMaxTimes: 5,
	},
}
```

## Sample

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
