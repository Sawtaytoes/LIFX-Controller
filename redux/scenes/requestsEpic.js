const { catchEpicError } = require('@redux-observable-backend/redux-utils')
const { combineEpics } = require('redux-observable')
const { map, pluck } = require('rxjs/operators')
const { ofRequestType } = require('@redux-observable-backend/websocket')

const {
	TOGGLE_SCENES,
	toggleScenes,
} = require('./actions')

const toggleScenesRequestEpic = (
	action$,
) => (
	action$
	.pipe(
		ofRequestType(TOGGLE_SCENES),
		pluck('names'),
		map(toggleScenes),
		catchEpicError(),
	)
)

const requestsEpic = (
	combineEpics(
		toggleScenesRequestEpic,
	)
)

module.exports = requestsEpic
