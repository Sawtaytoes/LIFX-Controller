const chalk = require('chalk')
const { bindNodeCallback, forkJoin, from, of } = require('rxjs')
const { filter, ignoreElements, map, mergeMap, switchMap, takeUntil, tap, toArray } = require('rxjs/operators')
const { ofType } = require('redux-observable')

const catchEpicError = require('$redux/utils/catchEpicError')
const { lightIdsSelector } = require('./selectors')
const { networkLightSelector } = require('$redux/lights/selectors')
const { POWERED_ON } = require('$redux/lifxNetwork/utils/constants')
const { stateSelector } = require('@ghadyani-framework/redux-utils')
const { TOGGLE_GROUP } = require('./actions')

const duration = 0

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
	action$,
	state$,
) => (
	action$
	.pipe(
		ofType(TOGGLE_GROUP),
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
						|| !lightIds.size
					)
					? (
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
					: (
						console
						.info(
							chalk
							.greenBright(
								'[TOGGLE GROUP]'
							)
							.concat(' ')
							.concat(
								chalk
								.bgGreen(
									groupName
								)
							)
						)
					)
				)),
				takeUntil(
					action$
					.pipe(
						ofType(TOGGLE_GROUP),
						filter(action => (
							action
							.groupName === groupName
						))
					)
				),
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
						// TODO: NEED TO HANDLE ERRORS IN HERE
						// OTHERWISE ONE ERROR WILL KILL THE ENTIRE FORKJOIN
						stateSelector({
							props: { lightId },
							selector: networkLightSelector,
							state$,
						})
						.pipe(
							filter(Boolean),
							switchMap(light => (
								bindNodeCallback(
									light
									.getPower
									.bind(light)
								)()
								.pipe(
									map(power => ({
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
		tap(lightsInGroup => {
			console
			.info(
				(
					'Lights in Group:'
				),
				(
					chalk
					.yellowBright(
						lightsInGroup
						.length
					)
				)
			)
		}),
		map(lightsInGroup => ({
			changeLightPower: (
				isLightOnInGroup(
					lightsInGroup
				)
				? turnOffLight
				: turnOnLight
			),
			lightsInGroup,
		})),
		mergeMap(({
			changeLightPower,
			lightsInGroup,
		}) => (
			from(lightsInGroup)
			.pipe(
				mergeMap(changeLightPower),
				catchEpicError(
					of(null)
				),
				toArray(),
			)
		)),
		catchEpicError(
			of(null)
		),
		ignoreElements(),
	)
)

module.exports = toggleGroupEpic
