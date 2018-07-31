const { ADD_LIGHT } = require('./actions')
const { createMergeById, createReducer } = require('@ghadyani-framework/redux-utils')

const mergeById = (
	createMergeById('id')
)

const initialState = []

const reducerActions = {
	[ADD_LIGHT]: (
		(prevState, { lights }) => (
			mergeById(
				prevState,
				lights,
			)
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
