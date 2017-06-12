const dir = require(`${global.baseDir}/global-dirs`)
const logger = require(`${dir.api}/logger`)

const POWERED_ON = 1
const DURATION = 1000

const lightSettingsMatch = ({ light: { settings }, sceneLightSettings }) => (
	// Power
	(settings.power ? 'on' : 'off') === sceneLightSettings.power

	// Color
	&& settings.color.hue === (sceneLightSettings.color.hue || 0)
	&& settings.color.saturation === (sceneLightSettings.color.saturation || 0)
	&& settings.color.kelvin === (sceneLightSettings.color.kelvin || 0)

	// Brightness only if lights are ON
	&& (
		settings.power === POWERED_ON
		? settings.brightness === sceneLightSettings.brightness / 100
		: true
	)
)

// const lightSettingsDoNotMatch = settings => !lightSettingsMatch(settings)
const lightSettingsDoNotMatch = ({ light, sceneLightSettings }) => {
	logger(light.label, lightSettingsMatch({ light, sceneLightSettings }))

	return !lightSettingsMatch({ light, sceneLightSettings })
}

const turnOnScene = sceneAndLightSettings => (
	sceneAndLightSettings
	.filter(lightSettingsDoNotMatch)
	.forEach(({
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
	}) => {
		light.color(hue, saturation * 100, brightness * 100, kelvin, DURATION)
		light[power](DURATION)
	})
)

const turnOffScene = sceneAndLightSettings => (
	sceneAndLightSettings
	.map(({ light }) => light)
	.filter(({ settings: { power } }) => power === POWERED_ON)
	.forEach(light => light.off(DURATION))
)

const toggleScene = (lifxClient, scene) => {
	const sceneAndLightSettings = (
		scene.states
		.map(sceneLightSettings => ({
			light: lifxClient.light(sceneLightSettings.id),
			sceneLightSettings,
		}))
	)

	const isSceneActive = sceneAndLightSettings.every(lightSettingsMatch)

	if (isSceneActive) {
		logger('Action: Turned-Off Lights')
		turnOffScene(sceneAndLightSettings)

	} else {
		logger('Action: Turned-On Scene')
		turnOnScene(sceneAndLightSettings)
	}
}

module.exports = (lifxClient, lifxConfig) => sceneName => {
	logger(`Command: Toggle Scene => ${sceneName}`)

	lifxClient.update()

	const scene = lifxConfig.scenes.get(sceneName)

	setTimeout(() => toggleScene(lifxClient, scene), 250)

	setTimeout(() => {
		lifxClient.update()
		lifxConfig.update()
	}, DURATION + 250)
}
