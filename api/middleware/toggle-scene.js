const fetch = require('node-fetch')

const dir = require(`${global.baseDir}/global-dirs`)
const config = require(`${dir.configs}config-settings`)
const logger = require(`${dir.api}/logger`)

const POWERED_ON = 'on'
const POWERED_OFF = 'off'

const getScene = sceneName => ({ name }) => sceneName === name
const isLightOn = ({ power }) => power === POWERED_ON

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

const headers = {
	Authorization: `Basic ${config.getApiKey()}`
}
const jsonHeaders = Object.assign({}, headers, {
	'Content-Type': 'application/json'
})

const getScenes = () => (
	fetch('https://api.lifx.com/v1/scenes', {
		method: 'GET',
		headers,
	})
	.then(response => response.json())
)

const getLightsInScene = scene => (
	fetch(`https://api.lifx.com/v1/lights/${scene.states.map(({ selector }) => selector).join(',')}`, {
		method: 'GET',
		headers,
	})
	.then(response => response.json())
)

const turnOnScene = ({ uuid }) => (
	fetch(`https://api.lifx.com/v1/scenes/scene_id:${uuid}/activate`, {
		method: 'PUT',
		headers: jsonHeaders,
	})
)

const turnOffScene = sceneAndLightSettings => {
	const body = JSON.stringify({
		states: (
			sceneAndLightSettings
			.map(({ lightSettings }) => lightSettings)
			.filter(isLightOn)
			.map(({ id }) => ({ selector: `id:${id}` }))
		),
		defaults: {
			power: POWERED_OFF,
		},
	})

	return fetch('https://api.lifx.com/v1/lights/states', {
		method: 'PUT',
		headers: jsonHeaders,
		body,
	})
}

const toggleScene = ([lights, scene]) => {
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
		return turnOffScene(sceneAndLightSettings)

	} else {
		logger('Action: Turned-On Scene')
		return turnOnScene(scene)
	}
}

module.exports = sceneName => {
	logger(`Command: Toggle Scene => ${sceneName}`)

	Promise.resolve()
	.then(getScenes)
	.then(scenes => (
		scenes.find(
			getScene(sceneName)
		)
	))
	.then(scene => Promise.all([
		getLightsInScene(scene),
		Promise.resolve(scene),
	]))
	.then(toggleScene)
	.catch(err => logger(`Error: ${err}`))
	.then(() => logger())
}
