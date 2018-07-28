const { combineEpics } = require('redux-observable')

const { lightsEpic, lightsReducer } = require('./lights')
const { webSocketsEpic, webSocketsReducers } = require('@ghadyani-framework/websocket')

const rootEpic = (
	combineEpics(
		lightsEpic,
		webSocketsEpic,
	)
)

const rootReducers = {
	...webSocketsReducers,
	lights: lightsReducer,
}

module.exports = {
	rootEpic,
	rootReducers,
}
