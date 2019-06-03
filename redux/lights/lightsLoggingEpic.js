const chalk = require('chalk')
const { combineEpics, ofType } = require('redux-observable')
const { ignoreElements, tap } = require('rxjs/operators')

const catchEpicError = require('$redux/utils/catchEpicError')

const {
	ADD_NETWORK_LIGHTS,
	REMOVE_NETWORK_LIGHT,
} = require('./actions')

const addedLightsLoggingEpic = (
	action$,
) => (
	action$
	.pipe(
		ofType(ADD_NETWORK_LIGHTS),
		tap(({
			lights,
		}) => {
			console
			.info(
				(
					'Discovered Lights:'
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
		tap(({
			lights,
		}) => {
			lights
			.length <= 10
			&& (
				console
				.info(
					'[Added Lights]',
					(
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
			)
		}),
		catchEpicError(),
		ignoreElements(),
	)
)

const removedLightLoggingEpic = (
	action$,
) => (
	action$
	.pipe(
		ofType(REMOVE_NETWORK_LIGHT),
		tap(({
			address,
			id,
		}) => {
			console
			.info(
				'[Removed Lights]',
				{
					address,
					id,
				},
			)
		}),
		catchEpicError(),
		ignoreElements(),
	)
)

const lightsLoggingEpic = (
	combineEpics(
		addedLightsLoggingEpic,
		removedLightLoggingEpic,
	)
)

module.exports = lightsLoggingEpic
