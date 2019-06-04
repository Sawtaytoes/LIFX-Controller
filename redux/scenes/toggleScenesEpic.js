const chalk = require('chalk')
const { bindNodeCallback, from, merge, of } = require('rxjs')
const { every, filter, ignoreElements, map, mapTo, mergeAll, mergeMap, pluck, reduce, switchMap, takeUntil, tap, toArray } = require('rxjs/operators')
const { ofType } = require('redux-observable')

const catchEpicError = require('$redux/utils/catchEpicError')
const { networkLightSelector } = require('$redux/lights/selectors')
const { sceneSelector } = require('./selectors')
const { stateSelector } = require('@ghadyani-framework/redux-utils')
const { TOGGLE_SCENES } = require('./actions')

const changeColorStateDuration = 500
const changePowerStateDuration = 0
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
		ofType(TOGGLE_SCENES),
		pluck('sceneNames'),
		mergeMap((
			sceneNames,
		) => (
			from(sceneNames)
			.pipe(
				mergeMap((
					sceneName,
				) => (
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
								ofType(TOGGLE_SCENES),
								filter((
									action,
								) => (
									action
									.sceneNames === sceneNames
								))
							)
						),
					)
				)),
				pluck('states'),
				filter(Boolean),
				reduce(
					(
						combinedStates,
						states,
					) => (
						combinedStates
						.concat(states)
					),
					[],
				),
			)
		)),
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
									isLightMatchingPoweredState: (
										isLightPowered
										&& isSceneLightPowered
									),
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
								catchEpicError(
									of(null)
								),
							)
						)),
					)
				)),
				filter(Boolean),
				toArray(),
				switchMap((
					lightStates,
				) => (
					from(lightStates)
					.pipe(
						pluck('isLightMatchingSceneState'),
						every(Boolean),
						tap(isSceneActive => {
							console.log({isSceneActive})
						}),
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
								merge(
									(
										from(lightStates)
										.pipe(
											tap(({
												isLightMatchingPoweredState,
												isLightMatchingSceneState,
												light,
											}) => {
												console.log(light.label, {
													isLightMatchingPoweredState,
													isLightMatchingSceneState,
												})
											}),
										)
									),
									(
										from(lightStates)
										.pipe(
											filter(({
												isLightMatchingSceneState,
											}) => (
												!isLightMatchingSceneState
											)),
											mergeMap(({
												light,
												sceneLightColor,
											}) => (
												console.log(light.label, 'color')||
												bindNodeCallback(
													light
													.color
													.bind(light)
												)(
													sceneLightColor.hue,
													sceneLightColor.saturation,
													sceneLightColor.brightness,
													sceneLightColor.kelvin,
													changeColorStateDuration,
												)
												.pipe(
													mapTo(light),
												)
											)),
											tap(light => {
												console.log(
													light.label,
													'SUCCESSFULLY CHANGED COLOR',
												)
											}),
										)
									),
									(
										from(lightStates)
										.pipe(
											filter(({
												isLightMatchingPoweredState,
											}) => (
												!isLightMatchingPoweredState
											)),
											mergeMap(({
												light,
												sceneLightPower,
											}) => (
												console.log(light.label, 'power')||
												bindNodeCallback(
													light[sceneLightPower]
													.bind(light)
												)(
													changePowerStateDuration,
												)
												.pipe(
													mapTo(light),
												)
											)),
											tap(light => {
												console.log(
													light.label,
													'SUCCESSFULLY CHANGED POWER',
												)
											}),
										)
									)
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
