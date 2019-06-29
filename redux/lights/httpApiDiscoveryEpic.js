const nodeFetch = require('node-fetch')
const { catchEpicError } = require('@redux-observable-backend/redux-utils')
const { configurationSetSelector } = require('@redux-observable-backend/node/redux/configurations/selectors')
const { filter, map, startWith, switchMap, tap } = require('rxjs/operators')
const { interval } = require('rxjs')
const { ofTaskName } = require('@redux-observable-backend/node')
const { ofType } = require('redux-observable')
const { START_TASK } = require('@redux-observable-backend/node/redux/tasks/actions')
const { stateSelector } = require('@redux-observable-backend/redux-utils')

const { addHttpApiLights } = require('./actions')
const { logError } = require('$utils/logging')

const httpApiDiscoveryEpic = (
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
		switchMap(({
			lifxApiAddress,
			lifxApiToken,
		}) => (
			interval(60000) // 10 minutes
			.pipe(
				startWith(null),
				switchMap(() => (
					nodeFetch(
						(
							lifxApiAddress
							.concat('/lights/all')
						),
						{
							headers: {
								'Accept-Encoding': 'gzip, deflate',
								'Authorization': `Bearer ${lifxApiToken}`,
							},
						},
					)
				))
			)
		)),
		switchMap(response => (
			response
			.json()
		)),
		tap((
			response,
		) => {
			response
			.error
			&& (
				logError(
					'API ERROR',
					(
						response
						.error
					),
				)
			)
		}),
		filter((
			response,
		) => (
			!(
				response
				.error
			)
		)),
		map(addHttpApiLights),
		catchEpicError(),
	)
)

module.exports = httpApiDiscoveryEpic
