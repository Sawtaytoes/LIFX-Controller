const { catchEpicError } = require('@ghadyani-framework/redux-utils')
const { map, pluck } = require('rxjs/operators')
const { ofType } = require('redux-observable')

const {
	TOGGLE_GROUP,
	toggleGroups,
} = require('./actions')

const toggleGroupEpic = (
	action$,
) => (
	action$
	.pipe(
		ofType(TOGGLE_GROUP),
		pluck('groupName'),
		map((
			groupName,
		) => ([
			groupName,
		])),
		map(toggleGroups),
		catchEpicError(),
	)
)

module.exports = toggleGroupEpic
