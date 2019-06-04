const { map, pluck } = require('rxjs/operators')
const { ofType } = require('redux-observable')

const catchEpicError = require('$redux/utils/catchEpicError')

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
		) => (
			[groupName]
		)),
		map(toggleGroups),
		catchEpicError(),
	)
)

module.exports = toggleGroupEpic
