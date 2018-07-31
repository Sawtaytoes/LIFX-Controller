const { createNamespaceReducer, createReducer } = require('@ghadyani-framework/redux-utils')
const { ADD_GROUP } = require('./actions')

const initialState = new Set()

const reducerActions = {
	[ADD_GROUP]: (
		(prevState, { lightId }) => (
			prevState
			.add(lightId)
		)
	),
}

const lightGroupsListReducer = (
	createNamespaceReducer(
		createReducer(
			reducerActions,
			initialState,
		)
	)
)

module.exports = lightGroupsListReducer
