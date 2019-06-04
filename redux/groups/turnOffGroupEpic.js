const { map, pluck } = require('rxjs/operators')
const { ofType } = require('redux-observable')

const catchEpicError = require('$redux/utils/catchEpicError')

const {
	TURN_OFF_GROUP,
	turnOffGroups,
} = require('./actions')

const turnOffGroupEpic = (
	action$,
) => (
	action$
	.pipe(
		ofType(TURN_OFF_GROUP),
		pluck('groupName'),
		map((
			groupName,
		) => ([
			groupName,
		])),
		map(turnOffGroups),
		catchEpicError(),
	)
)

module.exports = turnOffGroupEpic
