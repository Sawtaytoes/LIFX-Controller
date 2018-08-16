const chalk = require('chalk')
const { buffer, debounceTime, map, tap } = require('rxjs/operators')
const { ofType } = require('redux-observable')

const { ADD_LIFX_NETWORK_LIGHT } = require('$redux/lifxNetwork/actions')
const { addNetworkLights } = require('./actions')

const networkDiscoveryEpic = (
	action$ => (
		action$
		.pipe(
			ofType(ADD_LIFX_NETWORK_LIGHT),
			buffer(
				action$
				.pipe(
					ofType(ADD_LIFX_NETWORK_LIGHT),
					debounceTime(500),
				)
			),
			tap(lights => {
				console
				.info(
					chalk
					.yellowBright(
						lights
						.length
					)
				)
			}),
			map(addNetworkLights),
		)
	)
)

module.exports = networkDiscoveryEpic
