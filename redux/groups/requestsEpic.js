const { combineEpics } = require('redux-observable')
const { map, pluck } = require('rxjs/operators')
const { ofRequestType } = require('@redux-observable-backend/websocket')

const {
	TOGGLE_GROUP,
	toggleGroup,
} = require('./actions')

const toggleGroupRequestEpic = (
	action$,
) => (
	action$
	.pipe(
		ofRequestType(TOGGLE_GROUP),
		pluck('groupName'),
		map(toggleGroup),
	)
)

const requestsEpic = (
	combineEpics(
		toggleGroupRequestEpic,
	)
)

module.exports = requestsEpic
