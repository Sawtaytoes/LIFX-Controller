const createReducer = require('@ghadyani-framework/node/redux/utils/createReducer')
const namespaceReducer = require('@ghadyani-framework/node/redux/utils/namespaceReducer')
const { ADD_GROUP } = require('./actions')

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
