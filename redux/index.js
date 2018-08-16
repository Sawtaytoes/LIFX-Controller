const { combineEpics } = require('redux-observable')
const { combineReducers } = require('redux')
const { webSocketsEpic, webSocketsReducers } = require('@ghadyani-framework/websocket')

const {
	groupsEpic,
	groupsReducer,
} = require('./groups')

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
		webSocketsEpic,
	)
)

const rootReducers = {
	...webSocketsReducers,
	groups: groupsReducer,
	lifxNetwork: lifxNetworkReducer,
	lights: lightsReducer,
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
