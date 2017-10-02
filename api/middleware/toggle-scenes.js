const Promise = require('bluebird')

const dir = require(`${global.baseDir}/global-dirs`)
const logger = require(`${dir.utils}/logger`)

const POWERED_ON = 1
const POWERED_OFF = 0
const DURATION = 1000
const MARGIN_OF_ERROR = 2

const isLightOnline = Boolean
const getLightById = lifxClient => ({ id }) => lifxClient.light(id)

const relativeEquals = (value1 = 0, value2 = 0) => (
	value1 - MARGIN_OF_ERROR <= value2
	&& value1 + MARGIN_OF_ERROR >= value2
)

const lightMatchesScene = ({ light: { settings }, sceneLightSettings }) => (
	(settings.power ? 'on' : 'off') === sceneLightSettings.power

	// Check against other settings only if lights are powered on
	&& (
		settings.power === POWERED_OFF
		|| (
			relativeEquals(settings.brightness, sceneLightSettings.brightness * 100)
			&& relativeEquals(settings.color.hue, sceneLightSettings.color.hue)
			&& relativeEquals(settings.color.saturation, (sceneLightSettings.color.saturation || 0) * 100)
			&& relativeEquals(settings.color.kelvin, sceneLightSettings.color.kelvin)
		)
	)
)

const lightDoesNotMatchScene = settings => !lightMatchesScene(settings)

const isSceneActive = sceneAndLightSettings => (
	sceneAndLightSettings.every(lightMatchesScene)
)

const changeLightColor = (hue, saturation, brightness, kelvin) => light => (
	Promise.promisify(light.color, { context: light })(
		hue,
		saturation,
		brightness,
		kelvin,
		DURATION
	)
)

const changeLightPower = powerFuncName => light => (
	Promise.promisify(light[powerFuncName], { context: light })(DURATION)
)

const turnOffLight = changeLightPower('off')

const turnOnScene = sceneAndLightSettings => (
	sceneAndLightSettings
	.filter(lightDoesNotMatchScene)
	.map(({
		light,
		sceneLightSettings: {
			brightness,
			color: {
				hue = 0,
				saturation = 0,
				kelvin
			},
			power,
		},
	}) => (
		Promise.resolve(light)
		.then(changeLightColor(hue, saturation * 100, brightness * 100, kelvin))
		.then(() => light)
		.then(changeLightPower(power))
	))
)

const turnOffScene = sceneAndLightSettings => (
	sceneAndLightSettings
	.map(({ light }) => light)
	.filter(({ settings: { power } }) => power === POWERED_ON)
	.map(turnOffLight)
)

const toggleScene = sceneAndLightSettings => (
	Promise.all(
		isSceneActive(sceneAndLightSettings)
		? turnOffScene(sceneAndLightSettings)
		: turnOnScene(sceneAndLightSettings)
	)
)

const getSceneAndLightsSettings = scene => lights => (
	scene.states
	.map(sceneLightSettings => ({
		light: lights.find(({ id }) => id === sceneLightSettings.id),
		sceneLightSettings,
	}))
	.filter(({ light }) => light)
)

const combineLightsInScenes = lightsInScenes => (
	lightsInScenes.reduce(
		(combined, lightsInScene) => combined.concat(lightsInScene),
		[]
	)
)

const getLightsInScene = lifxClient => scene => (
	scene.lights
	.map(getLightById(lifxClient))
	.filter(isLightOnline)
)

module.exports = (lifxClient, lifxConfig) => sceneNames => {
	logger.log(`Command: Toggle Scenes => ${sceneNames.join(', ')}`)

	const scenes = (
		sceneNames
		.map(sceneName => lifxConfig.scenes.get(sceneName))
		.filter(Boolean)
	)

	console.log(scenes);

	if (!scenes.length) return 'Scenes do not exist.'

	Promise.all(
		scenes
		.map(getLightsInScene(lifxClient))
		.map(lifxClient.update)
		.map((promise, index) => (
			promise.then(getSceneAndLightsSettings(scenes[index]))
		))
	)
	.then(combineLightsInScenes)
	.then(toggleScene)
	.then(lifxConfig.update)
	.catch(logger.logError)
}
