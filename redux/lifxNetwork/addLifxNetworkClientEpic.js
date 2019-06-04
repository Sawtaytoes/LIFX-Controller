const nodeLifx = require('node-lifx')
const { catchEpicError } = require('@ghadyani-framework/redux-utils')
const { map, mapTo } = require('rxjs/operators')
const { ofTaskName } = require('@ghadyani-framework/node')
const { ofType } = require('redux-observable')
const { START_TASK } = require('@ghadyani-framework/node/redux/tasks/actions')

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
			nodeLifx
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
