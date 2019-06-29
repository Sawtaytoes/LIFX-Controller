const { ADD_LIFX_NETWORK_CLIENT } = require('./actions')
const { createReducer } = require('@redux-observable-backend/redux-utils')

const initialState = {}

const reducerActions = {
	[ADD_LIFX_NETWORK_CLIENT]: (
		(prevState, { lifxNetworkClient }) => (
			lifxNetworkClient
		)
	),
}

const lifxNetworkClientReducer = (
	createReducer(
		reducerActions,
		initialState,
	)
)

module.exports = lifxNetworkClientReducer
