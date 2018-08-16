const { combineEpics } = require('redux-observable')
const { combineReducers } = require('redux')

const addlifxNetworkClientEpic = require('./addlifxNetworkClientEpic')
const initializeLifxNetworkClientEpic = require('./initializeLifxNetworkClientEpic')
const lifxNetworkClientReducer = require('./lifxNetworkClientReducer')
const lifxNetworkDiscoveryEpic = require('./lifxNetworkDiscoveryEpic')

const lifxNetworkEpic = (
	combineEpics(
		addlifxNetworkClientEpic,
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
	lifxNetworkEpic,
	lifxNetworkReducer,
}
