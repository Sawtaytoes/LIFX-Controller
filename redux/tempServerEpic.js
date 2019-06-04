const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const { merge, Observable, of } = require('rxjs')
const { configurationSetSelector } = require('@ghadyani-framework/node/redux/configurations/selectors')
const { ignoreElements, map, switchMap, tap } = require('rxjs/operators')
const { ofTaskName } = require('@ghadyani-framework/node')
const { ofType } = require('redux-observable')
const { START_TASK } = require('@ghadyani-framework/node/redux/tasks/actions')
const { stateSelector } = require('@ghadyani-framework/redux-utils')

const catchEpicError = require('$redux/utils/catchEpicError')
const { toggleGroup } = require('$redux/groups/actions')

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
								&& toggleGroup(names[0])
							)),
						)
					),
					(
						of(null)
						.pipe(
							tap(() => {
								server
								.listen(config.port, error => {
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

			// .get(
			// 	'/toggle-light/:name',
			// 	({ params: { name } }, res) => (
			// 		res.send(
			// 			toggleLights([name])
			// 		)
			// 	)
			// )

			// .put(
			// 	'/toggle-light',
			// 	({ body: { names } }, res) => (
			// 		res.send(
			// 			toggleLights(lifxClient, lifxConfig)(names)
			// 		)
			// 	)
			// )

			// .get(
			// 	'/toggle-scene/:sceneName',
			// 	({ params: { sceneName } }, res) => (
			// 		res.send(
			// 			toggleScenes(lifxClient, lifxConfig)([sceneName])
			// 		)
			// 	)
			// )

			// .put(
			// 	'/toggle-scene',
			// 	({ body: { names } }, res) => (
			// 		res.send(
			// 			toggleScenes(lifxClient, lifxConfig)(names)
			// 		)
			// 	)
			// )

			// .get(
			// 	'/turn-off-group/:groupName',
			// 	({ params: { groupName } }, res) => (
			// 		res.send(
			// 			turnOffGroups(lifxClient, lifxConfig)([groupName])
			// 		)
			// 	)
			// )

			// .put(
			// 	'/turn-off-group',
			// 	({ body: { names } }, res) => (
			// 		res.send(
			// 			turnOffGroups(lifxClient, lifxConfig)(names)
			// 		)
			// 	)
			// )
		tap(console.log),
		catchEpicError(),
	)
)

module.exports = tempServerEpic
