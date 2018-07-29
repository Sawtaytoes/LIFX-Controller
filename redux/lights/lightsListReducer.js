const { ADD_LIGHT } = require('./actions')
const { createReducer, namespaceReducer } = require('@ghadyani-framework/redux-utils')

const initialState = []

const reducerActions = {
	[ADD_LIGHT]: (
		(prevState, { httpApi, network }) => ({
			httpApi: (
				httpApi
				|| (
					prevState
					.httpApi
				)
			),
			network: (
				network
				|| (
					prevState
					.network
				)
			),
		})
	),
}

const lightsListReducer = (
	namespaceReducer(
		createReducer(
			reducerActions,
			initialState,
		)
	)
)

module.exports = lightsListReducer
