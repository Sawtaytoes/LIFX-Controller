const { combineEpics } = require('redux-observable')
const { combineReducers } = require('redux')

const addLifxNetworkClientEpic = require('./addLifxNetworkClientEpic')
const initializeLifxNetworkClientEpic = require('./initializeLifxNetworkClientEpic')
const lifxNetworkClientReducer = require('./lifxNetworkClientReducer')
const lifxNetworkDiscoveryEpic = require('./lifxNetworkDiscoveryEpic')

const lifxNetworkEpic = (
	combineEpics(
		addLifxNetworkClientEpic,
		initializeLifxNetworkClientEpic,
		lifxNetworkDiscoveryEpic,
	)
)

const lifxNetworkReducer = (
	combineReducers({
		lifxNetworkClient: lifxNetworkClientReducer,
	})
)

module.exports = {
	lifxNetwork: {
		actions: require('./actions'),
		selectors: require('./selectors'),
	},
	lifxNetworkEpic,
	lifxNetworkReducer,
}
