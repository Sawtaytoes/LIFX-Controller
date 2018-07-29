const createReducer = require('@ghadyani-framework/node/redux/utils/createReducer')
const namespaceReducer = require('@ghadyani-framework/node/redux/utils/namespaceReducer')
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
