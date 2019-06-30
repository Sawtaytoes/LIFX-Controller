const { catchEpicError } = require('@redux-observable-backend/redux-utils')
const { configurations, ofTaskName, tasks } = require('@redux-observable-backend/node')
const { filter, map, startWith, switchMap, tap } = require('rxjs/operators')
const { interval } = require('rxjs')
const { ofType } = require('redux-observable')

const { addHttpApiScenes } = require('./actions')
const { logError } = require('$utils/logging')

const httpApiDiscoveryEpic = (
	action$,
	state$,
	{ fetch },
) => (
	action$
	.pipe(
		ofType(
			tasks
			.actions
			.START_TASK
		),
		ofTaskName(
			'serve',
			'undefined',
		),
		map(() => state$.value),
		map(
			configurations
			.selectors
			.selectConfigurationSet()
		),
		switchMap(({
			lifxApiAddress,
			lifxApiToken,
		}) => (
			interval(60000) // 10 minutes
			.pipe(
				startWith(null),
				switchMap(() => (
					fetch(
						(
							lifxApiAddress
							.concat('/scenes')
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
		map(addHttpApiScenes),
		catchEpicError(),
	)
)

module.exports = httpApiDiscoveryEpic
