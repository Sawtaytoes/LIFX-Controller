const { combineEpics } = require('redux-observable')
const { map, pluck } = require('rxjs/operators')
const { ofRequestType } = require('@redux-observable-backend/websocket')

const {
	TOGGLE_SCENE,
	toggleScene,
} = require('./actions')

const toggleGroupRequestEpic = (
	action$,
) => (
	action$
	.pipe(
		ofRequestType(TOGGLE_SCENE),
		pluck('sceneName'),
		map(toggleScene),
	)
)

const requestsEpic = (
	combineEpics(
		toggleGroupRequestEpic,
	)
)

module.exports = requestsEpic
