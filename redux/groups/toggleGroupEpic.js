const chalk = require('chalk')
const { filter, ignoreElements, map, mergeMap, switchMap, tap, zip } = require('rxjs/operators')
const { bindNodeCallback, forkJoin, from } = require('rxjs')
const { ofType } = require('redux-observable')

const { lightIdsSelector } = require('./selectors')
const { networkLightSelector } = require('$redux/lights/selectors')
const { POWERED_ON } = require('$redux/lifxNetwork/utils/constants')
const { stateSelector } = require('@ghadyani-framework/redux-utils')
const { TOGGLE_GROUP } = require('./actions')

const duration = 500

const isLightOnInGroup = (
	lightsInGroup => (
		lightsInGroup
		.some(({ power }) => (
			power === POWERED_ON
		))
	)
)

const changeLightPower = (
	powerFuncName => ({ light }) => (
		bindNodeCallback(
			light[powerFuncName]
			.bind(light)
		)(
			duration,
		)
	)
)

const turnOffLight = changeLightPower('off')
const turnOnLight = changeLightPower('on')

const toggleGroupEpic = (
	(action$, state$) => (
		action$
		.pipe(
			ofType(TOGGLE_GROUP),
			tap(console.info),
			mergeMap(({ groupName }) => (
				stateSelector({
					props: { groupName },
					selector: lightIdsSelector,
					state$,
				})
				.pipe(
					tap(lightIds => (
						(
							!lightIds
							|| !lightIds.length
						)
						&& (
							console
							.warn(
								chalk
								.redBright(
									'[MISSING GROUP]'
								)
								.concat(' ')
								.concat(
									chalk
									.bgRed(
										groupName
									)
								)
							)
						)
					)),
				)
			)),
			filter(Boolean),
			map(lightIds => (
				Array
				.from(lightIds)
			)),
			mergeMap(lightIds => (
				forkJoin(
					...(
						lightIds
						.map(lightId => (
							// NEED TO HANDLE ERRORS IN HERE
							// OTHERWISE ONE ERROR WILL KILL THE ENTIRE FORKJOIN
							stateSelector({
								props: { lightId },
								selector: networkLightSelector,
								state$,
							})
							.pipe(
								filter(Boolean),
								switchMap(light => (
									// console.log(light.client.light(light.id))||
									bindNodeCallback(
										light
										.getPower
										.bind(light)
									)()
									.pipe(
										map(power => (console.log({power})||{
											light,
											power,
										}))
									)
								)),
							)
						))
						// from(lightIds)
						// .pipe(
						// 	map(lightId => (
						// 		stateSelector({
						// 			props: { lightId },
						// 			selector: networkLightSelector,
						// 			state$,
						// 		})
						// 	)),
						// )
					)
				)
			)),
			// tap(console.log),
			tap(t => console.log(t.length)),
			mergeMap(lightsInGroup => (
				isLightOnInGroup(lightsInGroup)
				? (
					lightsInGroup
					.map(turnOffLight)
				)
				: (
					lightsInGroup
					.map(turnOnLight)
				)
			)),
			tap(console.log),
			// mergeMap(lights => (
			// 	lights
			// )),
			mergeMap(light => (
				light
			)),
			// LOG WHEN FINISHED
			// tap(console.log),
			ignoreElements(),
		)
	)
)

module.exports = toggleGroupEpic
