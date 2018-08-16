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
