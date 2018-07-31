const { ADD_GROUP } = require('./actions')
const { createNamespaceReducer, createReducer } = require('@ghadyani-framework/redux-utils')

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
	createNamespaceReducer(
		createReducer(
			reducerActions,
			initialState,
		)
	)
)

module.exports = groupsListReducer
