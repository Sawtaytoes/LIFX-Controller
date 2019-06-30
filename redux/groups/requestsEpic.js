const { catchEpicError } = require('@redux-observable-backend/redux-utils')
const { combineEpics } = require('redux-observable')
const { map, pluck, tap } = require('rxjs/operators')
const { ofRequestType } = require('@redux-observable-backend/websocket')

const {
	TOGGLE_GROUPS,
	toggleGroups,
	TURN_OFF_GROUPS,
	turnOffGroups,
} = require('./actions')

const toggleGroupsRequestEpic = (
	action$,
) => (
	action$
	.pipe(
		ofRequestType(TOGGLE_GROUPS),
		pluck('names'),
		map(toggleGroups),
		catchEpicError(),
	)
)

const turnOffGroupsRequestEpic = (
	action$,
) => (
	action$
	.pipe(
		ofRequestType(TURN_OFF_GROUPS),
		pluck('names'),
		tap(console.log),
		map(turnOffGroups),
		catchEpicError(),
	)
)

const requestsEpic = (
	combineEpics(
		toggleGroupsRequestEpic,
		turnOffGroupsRequestEpic,
	)
)

module.exports = requestsEpic
