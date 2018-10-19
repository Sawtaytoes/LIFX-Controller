const { ADD_GROUP } = require('./actions')
const { createMappedNamespaceReducer, createReducer } = require('@ghadyani-framework/redux-utils')

const initialState = {}

const reducerActions = {
	[ADD_GROUP]: (
		(prevState, { group }) => ({
			...prevState,
			...group,
		})
	),
}

const groupsListReducer = (
	createMappedNamespaceReducer(
		createReducer(
			reducerActions,
			initialState,
		)
	)
)

module.exports = groupsListReducer
