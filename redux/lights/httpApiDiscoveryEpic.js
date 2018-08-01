const nodeFetch = require('node-fetch')
const { ADD_CONFIGURATION_SET } = require('@ghadyani-framework/node/redux/configurations/actions')
const { buffer, debounceTime, map, switchMap } = require('rxjs/operators')
const { configurationSetSelector } = require('@ghadyani-framework/node/redux/configurations/selectors')
const { ofType } = require('redux-observable')
const { stateSelector } = require('@ghadyani-framework/redux-utils')

const { addHttpApiLights } = require('./actions')

const httpApiDiscoveryEpic = (
	(action$, state$) => (
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
			map(addHttpApiLights),
		)
	)
)

module.exports = httpApiDiscoveryEpic
