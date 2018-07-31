const { combineEpics } = require('redux-observable')
const { combineReducers } = require('redux')

const httpApiDiscoveryEpic = require('./httpApiDiscoveryEpic')
const httpApiLightsListReducer = require('./httpApiLightsListReducer')
const networkDiscoveryEpic = require('./networkDiscoveryEpic')
const networkLightsListReducer = require('./networkLightsListReducer')
// const updateHttpApiEpic = require('./updateHttpApiEpic')

const lightsEpic = (
	combineEpics(
		httpApiDiscoveryEpic,
		networkDiscoveryEpic,
		// updateHttpApiEpic,
	)
)

const lightsReducer = (
	combineReducers({
		httpApiLightsList: httpApiLightsListReducer,
		networkLightsList: networkLightsListReducer,
	})
)

module.exports = {
	lightsEpic,
	lightsReducer,
}
