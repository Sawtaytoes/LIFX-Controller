const { combineEpics } = require('redux-observable')

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

module.exports = {
	rootEpic,
	rootReducers,
}
