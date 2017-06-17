const dir = require(`${global.baseDir}/global-dirs`)
const logger = require(`${dir.utils}/logger`)

const POWERED_ON = 1
const DURATION = 1000

const relativeEquals = (value1 = 0, value2 = 0) => (
	value1 - 1 <= value2 && value1 + 1 >= value2
)

const lightMatchesScene = ({ light: { settings }, sceneLightSettings }) => (
	// Power
	(settings.power ? 'on' : 'off') === sceneLightSettings.power

	// Brightness only if lights are ON
	&& (
		settings.power === POWERED_ON
		? relativeEquals(settings.brightness, sceneLightSettings.brightness * 100)
		: true
	)

	// Color
	&& relativeEquals(settings.color.hue, sceneLightSettings.color.hue)
	&& relativeEquals(settings.color.saturation, sceneLightSettings.color.saturation)
	&& relativeEquals(settings.color.kelvin, sceneLightSettings.color.kelvin)
)

const lightDoesNotMatchScene = settings => !lightMatchesScene(settings)

const isSceneActive = sceneAndLightSettings => sceneAndLightSettings.every(lightMatchesScene)

const changeLightColor = (hue, saturation, brightness, kelvin) => light => (
	new Promise((resolve, reject) => (
		light.color(
			hue, saturation, brightness, kelvin,
			DURATION,
			err => err ? reject(err) : resolve()
		)
	))
)

const changeLightPower = powerFuncName => light => (
	new Promise((resolve, reject) => (
		light[powerFuncName](DURATION, err => err ? reject(err) : resolve())
	))
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
		Promise.all([
			changeLightColor(hue, saturation * 100, brightness * 100, kelvin)(light),
			changeLightPower(power)(light),
		])
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

const getSceneAndLightSettings = scene => lights => (
	scene.states
	.map(sceneLightSettings => ({
		light: lights.find(({ id }) => id === sceneLightSettings.id),
		sceneLightSettings,
	}))
)

module.exports = (lifxClient, lifxConfig) => sceneName => {
	logger.log(`Command: Toggle Scene => ${sceneName}`)

	const scene = lifxConfig.scenes.get(sceneName)
	const lightsInScene = scene.lights.map(({ id }) => lifxClient.light(id))

	lifxClient.update(lightsInScene)
	.then(getSceneAndLightSettings(scene))
	.then(toggleScene)
	.then(lifxConfig.update)
	.catch(err => console.error(err))
}
