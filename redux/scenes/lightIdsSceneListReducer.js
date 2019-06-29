const { createMappedNamespaceReducer, createReducer } = require('@redux-observable-backend/redux-utils')
const { ADD_SCENE } = require('./actions')

const initialState = new Set()

const reducerActions = {
	[ADD_SCENE]: (
		prevState,
		{ scene },
	) => (
		scene
		.states
		.reduce(
			(
				combined,
				lightState,
			) => (
				new Set(combined)
				.add(
					lightState
					.selector
					.replace(
						/id:(.*)/,
						'$1',
					)
				)
			),
			prevState,
		)
	),
}

const lightIdsSceneListReducer = (
	createMappedNamespaceReducer(
		createReducer(
			reducerActions,
			initialState,
		)
	)
)

module.exports = lightIdsSceneListReducer
