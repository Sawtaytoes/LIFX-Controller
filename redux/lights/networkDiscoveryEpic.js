const chalk = require('chalk')
const { buffer, debounceTime, map, tap } = require('rxjs/operators')
const { combineEpics, ofType } = require('redux-observable')

const {
	ADD_LIFX_NETWORK_LIGHT,
	REMOVE_LIFX_NETWORK_LIGHT,
} = require('$redux/lifxNetwork/actions')

const {
	addNetworkLights,
	removeNetworkLight,
} = require('./actions')

const addLightsEpic = (
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

const removeLightEpic = (
	action$ => (
		action$
		.pipe(
			ofType(REMOVE_LIFX_NETWORK_LIGHT),
			map(removeNetworkLight),
		)
	)
)

const networkDiscoveryEpic = (
	combineEpics(
		addLightsEpic,
		removeLightEpic,
	)
)

module.exports = networkDiscoveryEpic
