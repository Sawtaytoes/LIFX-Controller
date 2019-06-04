const { combineEpics } = require('redux-observable')
const { combineReducers } = require('redux')

const addScenesEpic = require('./addScenesEpic')
const httpApiDiscoveryEpic = require('./httpApiDiscoveryEpic')
const requestsEpic = require('./requestsEpic')
const scenesListReducer = require('./scenesListReducer')
const toggleScenesEpic = require('./toggleScenesEpic')

const scenesEpic = (
	combineEpics(
		addScenesEpic,
		httpApiDiscoveryEpic,
		requestsEpic,
		toggleScenesEpic,
	)
)

const scenesReducer = (
	combineReducers({
		scenesList: scenesListReducer,
	})
)

module.exports = {
	scenesEpic,
	scenesReducer,
}