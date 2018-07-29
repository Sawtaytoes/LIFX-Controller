const { ADD_GROUP } = require('./actions')
const { createReducer, namespaceReducer } = require('@ghadyani-framework/redux-utils')

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
	namespaceReducer(
		createReducer(
			reducerActions,
			initialState,
		)
	)
)

module.exports = groupsListReducer
