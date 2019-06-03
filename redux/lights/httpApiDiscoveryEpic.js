const nodeFetch = require('node-fetch')
const { ADD_CONFIGURATION_SET } = require('@ghadyani-framework/node/redux/configurations/actions')
const { buffer, debounceTime, filter, map, switchMap, tap } = require('rxjs/operators')
const { configurationSetSelector } = require('@ghadyani-framework/node/redux/configurations/selectors')
const { ofType } = require('redux-observable')
const { stateSelector } = require('@ghadyani-framework/redux-utils')

const catchEpicError = require('$redux/utils/catchEpicError')
const { addHttpApiLights } = require('./actions')
const { logError } = require('$utils/logging')

const httpApiDiscoveryEpic = (
	action$,
	state$,
) => (
	action$
	.pipe(
		ofType(ADD_CONFIGURATION_SET),
		buffer(
			action$
			.pipe(
				ofType(ADD_CONFIGURATION_SET),
				debounceTime(300),
			)
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
