const chalk = require('chalk')
const { buffer, debounceTime, map, pluck, tap } = require('rxjs/operators')
const { combineEpics, ofType } = require('redux-observable')

const catchEpicError = require('$redux/utils/catchEpicError')

const {
	ADD_LIFX_NETWORK_LIGHT,
	REMOVE_LIFX_NETWORK_LIGHT,
} = require('$redux/lifxNetwork/actions')

const {
	addNetworkLights,
	removeNetworkLight,
} = require('./actions')

const addLightsEpic = (
	action$,
) => (
	action$
	.pipe(
		ofType(ADD_LIFX_NETWORK_LIGHT),
		pluck('light'),
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
				(
					'Network Lights:'
				),
				(
					chalk
					.yellowBright(
						lights
						.length
					)
				),
			)
		}),
		tap(lights => {
			lights
			.length < 5
			&& (
				console
				.info(
					lights
					.map(({
						address,
						id,
					}) => ({
						address,
						id,
					}))
				)
			)
		}),
		map(addNetworkLights),
		catchEpicError(),
	)
)

const removeLightEpic = (
	action$,
) => (
	action$
	.pipe(
		ofType(REMOVE_LIFX_NETWORK_LIGHT),
		map(removeNetworkLight),
		catchEpicError(),
	)
)

const networkDiscoveryEpic = (
	combineEpics(
		addLightsEpic,
		removeLightEpic,
	)
)

module.exports = networkDiscoveryEpic
