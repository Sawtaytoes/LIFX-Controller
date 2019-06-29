const lifxLanClient = require('lifx-lan-client')
const { catchEpicError } = require('@redux-observable-backend/redux-utils')
const { map, mapTo } = require('rxjs/operators')
const { ofTaskName } = require('@redux-observable-backend/node')
const { ofType } = require('redux-observable')
const { START_TASK } = require('@redux-observable-backend/node/redux/tasks/actions')

const { addLifxNetworkClient } = require('./actions')

const addLifxNetworkClientEpic = (
	action$,
) => (
	action$
	.pipe(
		ofType(START_TASK),
		ofTaskName(
			'serve',
			'undefined',
		),
		mapTo(
			lifxLanClient
			.Client
		),
		map(LifxClient => (
			new LifxClient()
		)),
		map(addLifxNetworkClient),
		catchEpicError(),
	)
)

module.exports = addLifxNetworkClientEpic
