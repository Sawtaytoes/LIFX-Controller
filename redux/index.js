const { combineEpics } = require('redux-observable')
const { combineReducers } = require('redux')
const { nodeEpic, nodeReducers } = require('@ghadyani-framework/node')
// const { webSocketsEpic, webSocketsReducers } = require('@ghadyani-framework/websocket')

const tempServerEpic = require('./tempServerEpic')

const {
	groupsEpic,
	groupsReducer,
} = require('./groups')

const {
	scenesEpic,
	scenesReducer,
} = require('./scenes')

const {
	lifxNetworkEpic,
	lifxNetworkReducer,
} = require('./lifxNetwork')

const {
	lightsEpic,
	lightsReducer,
} = require('./lights')

const rootEpic = (
	combineEpics(
		groupsEpic,
		lifxNetworkEpic,
		lightsEpic,
		scenesEpic,
		tempServerEpic,
		nodeEpic, // TEMP until WebSockets is configured
		// webSocketsEpic,
	)
)

const rootReducers = {
	...nodeReducers, // TEMP until WebSockets is configured
	// ...webSocketsReducers,
	groups: groupsReducer,
	lifxNetwork: lifxNetworkReducer,
	lights: lightsReducer,
	scenes: scenesReducer,
}

const rootReducer = (
	combineReducers(
		rootReducers,
	)
)

module.exports = {
	rootEpic,
	rootReducers,
	rootReducer,
}
