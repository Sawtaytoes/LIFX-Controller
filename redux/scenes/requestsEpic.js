const { combineEpics } = require('redux-observable')
const { map } = require('rxjs/operators')
const { ofRequestType } = require('@ghadyani-framework/websocket')

const {
	TOGGLE_SCENE,
	toggleScene,
} = require('./actions')

const toggleGroupRequestEpic = (
	action$ => (
		action$
		.pipe(
			ofRequestType(TOGGLE_SCENE),
			map(toggleScene),
		)
	)
)

const requestsEpic = (
	combineEpics(
		toggleGroupRequestEpic,
	)
)

module.exports = requestsEpic
