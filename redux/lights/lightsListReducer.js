const createReducer = require('@ghadyani-framework/node/redux/utils/createReducer')
const namespaceReducer = require('@ghadyani-framework/node/redux/utils/namespaceReducer')
const { ADD_LIGHT } = require('./actions')

const initialState = []

const reducerActions = {
	[ADD_LIGHT]: (
		(prevState, { light }) => (
			light
		)
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
