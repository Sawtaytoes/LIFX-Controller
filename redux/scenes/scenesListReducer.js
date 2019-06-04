const { ADD_SCENE } = require('./actions')
const { createMappedNamespaceReducer, createReducer } = require('@ghadyani-framework/redux-utils')

const initialState = {}

const reducerActions = {
	[ADD_SCENE]: (
		prevState,
		{ scene },
	) => ({
		...prevState,
		...scene,
	}),
}

const scenesListReducer = (
	createMappedNamespaceReducer(
		createReducer(
			reducerActions,
			initialState,
		)
	)
)

module.exports = scenesListReducer
