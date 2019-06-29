const { createMergeById, createReducer } = require('@redux-observable-backend/redux-utils')

const {
	ADD_NETWORK_LIGHTS,
	REMOVE_NETWORK_LIGHT,
} = require('./actions')

const mergeById = (
	createMergeById('id')
)

const initialState = []

const reducerActions = {
	[ADD_NETWORK_LIGHTS]: (
		(prevState, { lights }) => (
			mergeById(
				prevState,
				lights,
			)
		)
	),

	[REMOVE_NETWORK_LIGHT]: (
		(prevState, { light }) => (
			prevState
			.filter(({ id }) => (
				id !== light.id
			))
		)
	),
}

const networkLightsListReducer = (
	createReducer(
		reducerActions,
		initialState,
	)
)

module.exports = networkLightsListReducer
