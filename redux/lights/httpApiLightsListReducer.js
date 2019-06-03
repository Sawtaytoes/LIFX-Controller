const { ADD_HTTP_API_LIGHTS } = require('./actions')
const { createMergeById, createReducer } = require('@ghadyani-framework/redux-utils')

const mergeById = (
	createMergeById('id')
)

const initialState = []

const reducerActions = {
	[ADD_HTTP_API_LIGHTS]: (
		prevState,
		{ lights },
	) => (
		mergeById(
			prevState,
			lights,
		)
	),
}

const httpApiLightsListReducer = (
	createReducer(
		reducerActions,
		initialState,
	)
)

module.exports = httpApiLightsListReducer
