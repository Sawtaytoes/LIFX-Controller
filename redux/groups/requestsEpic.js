const { combineEpics } = require('redux-observable')
const { map } = require('rxjs/operators')
const { ofRequestType } = require('@ghadyani-framework/websocket')

const {
	TOGGLE_GROUP,
	toggleGroup,
} = require('./actions')

const toggleGroupRequestEpic = (
	action$ => (
		action$
		.pipe(
			ofRequestType(TOGGLE_GROUP),
			map(toggleGroup),
		)
	)
)

const requestsEpic = (
	combineEpics(
		toggleGroupRequestEpic,
	)
)

module.exports = requestsEpic
