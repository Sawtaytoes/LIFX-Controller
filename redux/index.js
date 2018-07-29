const { combineEpics } = require('redux-observable')
const { combineReducers } = require('redux')

const { groupsEpic, groupsReducer } = require('./groups')
const { lightsEpic, lightsReducer } = require('./lights')
const { webSocketsEpic, webSocketsReducers } = require('@ghadyani-framework/websocket')

const rootEpic = (
	combineEpics(
		groupsEpic,
		lightsEpic,
		webSocketsEpic,
	)
)

const rootReducers = {
	...webSocketsReducers,
	groups: groupsReducer,
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
