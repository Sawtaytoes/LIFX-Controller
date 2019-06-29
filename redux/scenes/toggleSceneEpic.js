const { catchEpicError } = require('@redux-observable-backend/redux-utils')
const { map, pluck } = require('rxjs/operators')
const { ofType } = require('redux-observable')

const {
	TOGGLE_SCENE,
	toggleScenes,
} = require('./actions')

const toggleSceneEpic = (
	action$,
) => (
	action$
	.pipe(
		ofType(TOGGLE_SCENE),
		pluck('sceneName'),
		map((
			sceneName,
		) => ([
			sceneName,
		])),
		map(toggleScenes),
		catchEpicError(),
	)
)

module.exports = toggleSceneEpic
