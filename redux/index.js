const { combineEpics } = require('redux-observable')
const { combineReducers } = require('redux')
const { webSocketsEpic, webSocketsReducers } = require('@redux-observable-backend/websocket')

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
		webSocketsEpic,
	)
)

const rootReducers = {
	...webSocketsReducers,
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
