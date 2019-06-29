const { catchEpicError } = require('@redux-observable-backend/redux-utils')
const { map, mergeAll, pluck } = require('rxjs/operators')
const { ofType } = require('redux-observable')

const {
	ADD_HTTP_API_SCENES,
	addScene,
} = require('./actions')

const addScenesEpic = (
	action$,
) => (
	action$
	.pipe(
		ofType(ADD_HTTP_API_SCENES),
		pluck('scenes'),
		mergeAll(),
		map((
			scene,
		) => ({
			namespace: (
				scene
				.name
			),
			scene,
		})),
		map(addScene),
		catchEpicError(),
	)
)

module.exports = addScenesEpic
