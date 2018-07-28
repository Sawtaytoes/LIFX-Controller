const createReducer = require('@ghadyani-framework/node/redux/utils/createReducer')
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
	createReducer(
		reducerActions,
		initialState,
	)
)

module.exports = lightsListReducer
