const chalk = require('chalk')
const { bindNodeCallback, forkJoin, from } = require('rxjs')
const { every, filter, ignoreElements, map, mergeAll, mergeMap, pluck, switchMap, takeUntil, tap, toArray } = require('rxjs/operators')
const { ofType } = require('redux-observable')

const catchEpicError = require('$redux/utils/catchEpicError')
const { networkLightSelector } = require('$redux/lights/selectors')
const { sceneSelector } = require('./selectors')
const { stateSelector } = require('@ghadyani-framework/redux-utils')
const { TOGGLE_SCENE } = require('./actions')

const changePowerStateDuration = 250
const marginOfError = 2

const relativeEquals = (
	value1 = 0,
	value2 = 0,
) => (
	value1 - marginOfError <= value2
	&& value1 + marginOfError >= value2
)

const toggleScenesEpic = (
	action$,
	state$,
) => (
	action$
	.pipe(
		ofType(TOGGLE_SCENE),
		tap(console.log),
		mergeMap(({
			sceneName,
		}) => (
			stateSelector({
				props: { sceneName },
				selector: sceneSelector,
				state$,
			})
			.pipe(
				tap((
					scene,
				) => (
					scene
					? (
						console
						.info(
							chalk
							.greenBright(
								'[TOGGLE SCENE]'
							),
							(
								chalk
								.bgGreen(
									sceneName
								)
							)
						)
					)
					: (
						console
						.warn(
							chalk
							.redBright(
								'[MISSING SCENE]'
							),
							(
								chalk
								.bgRed(
									sceneName
								)
							)
						)
					)
				)),
				takeUntil(
					action$
					.pipe(
						ofType(TOGGLE_SCENE),
						filter((
							action,
						) => (
							action
							.sceneName === sceneName
						))
					)
				),
			)
		)),
		filter(Boolean),
		pluck('states'),
		tap((
			states,
		) => {
			console
			.info(
				(
					'Lights in Scene:'
				),
				(
					chalk
					.yellowBright(
						states
						.length
					)
				)
			)
		}),
		mergeMap((
			states,
		) => (
			from(states)
			.pipe(
				mergeMap(({
					brightness: sceneLightBrightness,
					color: sceneLightColor,
					lightId,
					power: sceneLightPower,
				}) => (
					stateSelector({
						props: { lightId },
						selector: networkLightSelector,
						state$,
					})
					.pipe(
						filter(Boolean),
						switchMap((
							light,
						) => (
							bindNodeCallback(
								light
								.getState
								.bind(light)
							)()
							.pipe(
								map(({
									color: lightColor,
									power: lightPower,
								}) => ({
									isLightPowered: (
										Boolean(lightPower)
									),
									isSceneLightPowered: (
										sceneLightPower === 'on'
									),
									light,
									lightColor,
									sceneLightColor: {
										...sceneLightColor,
										brightness: (
											sceneLightBrightness * 100
										),
										saturation: (
											sceneLightColor.saturation * 100
											|| 0
										),
									},
									sceneLightPower,
								})),

								// TEMP vv DEBUGGING
								tap(({
									isLightPowered,
									isSceneLightPowered,
									light,
									lightColor,
									sceneLightColor,
								}) => {
									console.log(
										light.label,
										{
											isLightPowered,
											isSceneLightPowered,
											lightColor,
											sceneLightColor,
										}
									)
								}),
								// TEMP ^^ DEBUGGING

								map(({
									isLightPowered,
									isSceneLightPowered,
									light,
									lightColor,
									sceneLightColor,
								}) => ({
									isLightMatchingSceneState: (
										(
											!isLightPowered
											&& !isSceneLightPowered
										)
										|| (
											(
												isLightPowered
												&& isSceneLightPowered
											)
											&& (
												relativeEquals(
													lightColor.brightness,
													sceneLightColor.brightness,
												)
											)
											&& (
												relativeEquals(
													lightColor.hue,
													sceneLightColor.hue,
												)
											)
											&& (
												relativeEquals(
													lightColor.kelvin,
													sceneLightColor.kelvin,
												)
											)
											&& (
												relativeEquals(
													lightColor.saturation,
													sceneLightColor.saturation,
												)
											)
										)
									),
									light,
									sceneLightColor,
									sceneLightPower,
								})),
							)
						)),
					)
				)),
				toArray(),
				switchMap((
					lightStates,
				) => (
					from(lightStates)
					.pipe(
						pluck('isLightMatchingSceneState'),
						every(Boolean),
						tap(t => console.log({isSceneActive: t})),
						switchMap((
							isSceneActive,
						) => (
							isSceneActive
							? (
								from(lightStates)
								.pipe(
									pluck('light'),
									map((
										light,
									) => (
										bindNodeCallback(
											light
											.off
											.bind(light)
										)(
											changePowerStateDuration,
										)
									)),
									mergeAll(),
								)
							)
							: (
								from(lightStates)
								.pipe(
									tap(({
										isLightMatchingSceneState,
										light,
										sceneLightPower,
									}) => {
										console.log(light.label, {
											isLightMatchingSceneState,
											sceneLightPower,
										})
									}),
									filter(({
										isLightMatchingSceneState,
									}) => (
										!isLightMatchingSceneState
									)),
									map(({
										light,
										sceneLightColor,
										sceneLightPower,
									}) => ({
										changeLightColor: (
											bindNodeCallback(
												light
												.color
												.bind(light)
											)(
												sceneLightColor.hue,
												sceneLightColor.saturation,
												sceneLightColor.brightness,
												sceneLightColor.kelvin,
												0,
											)
										),
										changeLightPower: (
											bindNodeCallback(
												light[sceneLightPower]
												.bind(light)
											)(
												changePowerStateDuration,
											)
										),
										light: from([light]),
									})),
									mergeMap((
										turnOnSceneObservables,
									) => (
										forkJoin(turnOnSceneObservables)
									)),
									tap(t => console.log(t.light.label)),
									// tap(t => console.log(t.light.label, {
									// 	changeLightColor: t.changeLightColor,
									// 	changeLightPower: t.changeLightPower,
									// })),
								)
							)
						)),
					)
				)),
			)
		)),
		// tap(({
		// 	numberOfLightsInScene,
		// 	numberOfToggledLightsInScene,
		// }) => (
		// 	numberOfLightsInScene
		// 	!== numberOfToggledLightsInScene
		// 	&& (
		// 		console
		// 		.error(
		// 			chalk
		// 			.redBright(
		// 				'[NOT ALL LIGHTS TOGGLED]'
		// 			),
		// 			(
		// 				chalk
		// 				.bgRed({
		// 					actual: numberOfToggledLightsInScene,
		// 					expected: numberOfLightsInScene,
		// 				})
		// 			)
		// 		)
		// 	)
		// )),
		catchEpicError(),
		ignoreElements(),
	)
)

module.exports = toggleScenesEpic
