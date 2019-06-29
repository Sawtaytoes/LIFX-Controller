const { ADD_SCENE } = require('./actions')
const { createMappedNamespaceReducer, createReducer } = require('@redux-observable-backend/redux-utils')

const initialState = {}

const reducerActions = {
	[ADD_SCENE]: (
		prevState,
		{ scene },
	) => ({
		...prevState,
		...scene,
		states: (
			scene
			.states
			.map(({
				selector,
				...props
			}) => ({
				...props,
				lightId: (
					selector
					.replace(
						/^id:(.*)$/,
						'$1',
					)
				),
			}))
		),
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
