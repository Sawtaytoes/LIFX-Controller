const { map, mergeAll, pluck } = require('rxjs/operators')
const { ofType } = require('redux-observable')

const catchEpicError = require('$redux/utils/catchEpicError')

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
				.uuid
			),
			scene,
		})),
		map(addScene),
		catchEpicError(),
	)
)

module.exports = addScenesEpic
