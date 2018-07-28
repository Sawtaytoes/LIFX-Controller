const { combineEpics } = require('redux-observable')
const { combineReducers } = require('redux')

// const groupsListReducer = require('./groupsListReducer')
const lightsCountEpic = require('./lightsCountEpic')
const lightsListReducer = require('./lightsListReducer')
const networkDiscoveryEpic = require('./networkDiscoveryEpic')
// const scenesListReducer = require('./scenesListReducer')
// const updateHttpApiEpic = require('./updateHttpApiEpic')

const lightsEpic = (
	combineEpics(
		lightsCountEpic,
		networkDiscoveryEpic,
		// updateHttpApiEpic,
	)
)

const lightsReducer = (
	combineReducers({
		// groupsList: groupsListReducer,
		lightsList: lightsListReducer,
		// scenesList: scenesListReducer,
	})
)

module.exports = {
	lightsEpic,
	lightsReducer,
}
