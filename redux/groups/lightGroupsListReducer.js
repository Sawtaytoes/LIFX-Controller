const { createReducer, namespaceReducer } = require('@ghadyani-framework/redux-utils')
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
	namespaceReducer(
		createReducer(
			reducerActions,
			initialState,
		)
	)
)

module.exports = lightGroupsListReducer
