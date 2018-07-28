const { combineEpics } = require('redux-observable')
const { map } = require('rxjs/operators')

const { ofRequestType } = require('$redux/utils/actionTypeCheckers')

const {
	JOIN_CHANNEL,
	joinChannel,
	LEAVE_CHANNEL,
	leaveChannel,
} = require('./actions')

const joinChannelRequestEpic = (
	action$ => (
		action$
		.pipe(
			ofRequestType(JOIN_CHANNEL),
			map(({ channelName, connection }) => (
				joinChannel({
					connection,
					namespace: channelName,
				})
			)),
		)
	)
)

const leaveChannelRequestEpic = (
	action$ => (
		action$
		.pipe(
			ofRequestType(LEAVE_CHANNEL),
			map(({ channelName, connection }) => (
				leaveChannel({
					connection,
					namespace: channelName,
				})
			)),
		)
	)
)

const requestsEpic = (
	combineEpics(
		joinChannelRequestEpic,
		leaveChannelRequestEpic,
	)
)

module.exports = requestsEpic
