const nodeFetch = require('node-fetch')
const { buffer, debounceTime, map, switchMap } = require('rxjs/operators')
const { ofType } = require('redux-observable')

const stateSelector = require('@ghadyani-framework/node/redux/utils/rxjs/stateSelector')
const { ADD_CONFIGURATION_SET } = require('@ghadyani-framework/node/redux/configurations/actions')
const { addLight } = require('./actions')
const { getConfigurationSet } = require('@ghadyani-framework/node/redux/configurations/selectors')

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
					selector: getConfigurationSet,
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
			switchMap(lightsList => (
				lightsList
			)),
			map(light => ({
				httpApi: light,
			})),
			map(addLight),
		)
	)
)

module.exports = httpApiDiscoveryEpic
