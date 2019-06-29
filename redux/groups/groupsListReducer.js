const { ADD_GROUP } = require('./actions')
const { createMappedNamespaceReducer, createReducer } = require('@redux-observable-backend/redux-utils')

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
