const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const { merge, Observable, of } = require('rxjs')
const { configurationSetSelector } = require('@redux-observable-backend/node/redux/configurations/selectors')
const { ignoreElements, map, switchMap, tap } = require('rxjs/operators')
const { ofTaskName } = require('@redux-observable-backend/node')
const { ofType } = require('redux-observable')
const { START_TASK } = require('@redux-observable-backend/node/redux/tasks/actions')
const { catchEpicError, stateSelector } = require('@redux-observable-backend/redux-utils')

const {
	toggleGroup,
	toggleGroups,
	turnOffGroup,
	turnOffGroups,
} = require('$redux/groups/actions')

const {
	toggleScene,
	toggleScenes,
} = require('$redux/scenes/actions')

const {
	logError,
	logInfo,
} = require('$utils/logging')

const tempServerEpic = (
	action$,
	state$,
) => (
	action$
	.pipe(
		ofType(START_TASK),
		ofTaskName(
			'serve',
			'undefined',
		),
		switchMap(() => (
			stateSelector({
				selector: configurationSetSelector,
				state$,
			})
		)),
		switchMap((
			config,
		) => {
			const server = express()
			const serverUrl = `${config.protocol}://${config.hostname}:${config.port}`

			server
			.use(compression())
			.use(helmet())
			.use(cors({
				origin: (
					serverUrl
					.replace('0.0.0.0', 'localhost')
				),
				optionsSuccessStatus: 200,
			}))
			.use(bodyParser.json())
			.use(bodyParser.urlencoded({ extended: true }))

			.disable('x-powered-by')

			const createBindingObservable = (
				func,
			) => (
				...args
			) => (
				Observable
				.create((
					observer,
				) => {
					func(
						...[
							...args,
							(
								(
									...callbackArgs
								) => {
									observer
									.next(callbackArgs)
								}
							),
						]
					)
				})
			)

			const createGetObservable = (
				createBindingObservable(
					server
					.get
					.bind(server)
				)
			)

			const createPutObservable = (
				createBindingObservable(
					server
					.put
					.bind(server)
				)
			)

			return (
				merge(
					(
						createGetObservable(
							'/',
						)
						.pipe(
							tap(([, res]) => res.send('You no be hearz.')),
						)
					),
					(
						createGetObservable(
							'/toggle-group/:groupName',
						)
						.pipe(
							map(([{ params: { groupName } }, res]) => (
								res.send('')
								&& toggleGroup(groupName)
							)),
						)
					),
					(
						createPutObservable(
							'/toggle-group',
						)
						.pipe(
							map(([{ body: { names } }, res]) => (
								res.send('')
								&& toggleGroups(names)
							)),
						)
					),
					(
						createGetObservable(
							'/toggle-scene/:sceneName',
						)
						.pipe(
							map(([{ params: { sceneName } }, res]) => (
								res.send('')
								&& toggleScene(sceneName)
							)),
						)
					),
					(
						createPutObservable(
							'/toggle-scene',
						)
						.pipe(
							map(([{ body: { names } }, res]) => (
								res.send('')
								&& toggleScenes(names)
							)),
						)
					),
					(
						createGetObservable(
							'/turn-off-group/:groupName',
						)
						.pipe(
							map(([{ params: { groupName } }, res]) => (
								res.send('')
								&& turnOffGroup(groupName)
							)),
						)
					),
					(
						createPutObservable(
							'/turn-off-group',
						)
						.pipe(
							map(([{ body: { names } }, res]) => (
								res.send('')
								&& turnOffGroups(names)
							)),
						)
					),
					(
						of(null)
						.pipe(
							tap(() => {
								server
								.listen(config.port + 1, error => {
									error
									? logError(error)
									: (
										logInfo(
											'Web Server running as',
											serverUrl,
										)
									)
								})
							}),
							ignoreElements(),
						)
					),
				)
			)
		}),
		catchEpicError(),
	)
)

module.exports = tempServerEpic
