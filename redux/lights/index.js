const { combineEpics } = require('redux-observable')
const { combineReducers } = require('redux')

const httpApiCacheEpic = require('./httpApiCacheEpic')
const httpApiDiscoveryEpic = require('./httpApiDiscoveryEpic')
const httpApiLightsListReducer = require('./httpApiLightsListReducer')
const lightsLoggingEpic = require('./lightsLoggingEpic')
const networkDiscoveryEpic = require('./networkDiscoveryEpic')
const networkLightsListReducer = require('./networkLightsListReducer')
// const updateHttpApiEpic = require('./updateHttpApiEpic')

const lightsEpic = (
	combineEpics(
		httpApiCacheEpic,
		httpApiDiscoveryEpic,
		lightsLoggingEpic,
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
