const dir = require(`${global.baseDir}/global-dirs`)
const logger = require(`${dir.api}/logger`)

const POWERED_ON = 1
const DURATION = 1000

const lightSettingsMatch = ({ lightSettings, sceneSettings }) => (
	// Power
	lightSettings.power === sceneSettings.power

	// Color
	&& lightSettings.color.hue === (sceneSettings.color.hue || 0)
	&& lightSettings.color.saturation === (sceneSettings.color.saturation || 0)
	&& lightSettings.color.kelvin === (sceneSettings.color.kelvin || 0)

	// Brightness only if lights are ON
	&& (
		lightSettings.power === POWERED_ON
		? lightSettings.brightness === sceneSettings.brightness
		: true
	)
)

const lightSettingsDoNotMatch = settings => !lightSettingsMatch(settings)

const turnOnScene = lifxClient => sceneAndLightSettings => (
	sceneAndLightSettings
	.filter(lightSettingsDoNotMatch)
	.map(settings => Object.assign({}, settings, {
		light: lifxClient.light(settings.lightSettings.id),
	}))
	.forEach(({
		light,
		sceneSettings: {
			brightness,
			color: {
				hue = 0,
				saturation = 0,
				kelvin
			},
		},
	}) => {
		light.color(hue, saturation * 100, brightness * 100, kelvin, DURATION)
		light.on(DURATION)
	})
)

const turnOffScene = lifxClient => sceneAndLightSettings => (
	sceneAndLightSettings
	.map(({ lightSettings }) => lifxClient.light(lightSettings.id))
	.filter(({ settings: { power } }) => power === POWERED_ON)
	.forEach(light => light.off(DURATION))
)

const toggleScene = (scene, lights, { turnOnScene, turnOffScene }) => {
	const sceneAndLightSettings = (
		scene.states
		.map((sceneSettings, index) => ({
			lightSettings: lights[index],
			sceneSettings,
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

module.exports = lifxConfig => lifxClient => sceneName => {
	logger(`Command: Toggle Scene => ${sceneName}`)

	const scene = lifxConfig.scenes.get(sceneName)
	const lightsInScene = scene.lights

	toggleScene(scene, lightsInScene, {
		turnOnScene: turnOnScene(lifxClient),
		turnOffScene: turnOffScene(lifxClient),
	})

	setTimeout(() => {
		lifxClient.update()
		lifxConfig.update()
	}, DURATION)
}
