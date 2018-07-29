const createReducer = require('@ghadyani-framework/node/redux/utils/createReducer')
const namespaceReducer = require('@ghadyani-framework/node/redux/utils/namespaceReducer')
const { ADD_LIGHT } = require('./actions')

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
