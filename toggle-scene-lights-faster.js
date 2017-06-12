const sceneName = `${Math.round(Math.random()) ? 'Normal' : 'Bright'} Living Room`
console.debug(sceneName)

const getScene = ({ name }) => name === sceneName
const isLightOn = ({ power }) => power === 'on'

const lightSettingsMatch = ({ lightSettings, sceneSettings }) => (
	lightSettings.power === sceneSettings.power
	&& lightSettings.color.hue === (sceneSettings.color.hue || 0)
	&& lightSettings.color.saturation === (sceneSettings.color.saturation || 0)
	&& lightSettings.color.kelvin === (sceneSettings.color.kelvin || 0)
	&& lightSettings.brightness === sceneSettings.brightness
)

const headers = {
	Authorization: 'Basic YzFjZDJhY2EyZDMzMmQ1NmI4MmY0ODQyNDIyN2Y5ZGIzNmY4NWE4YjU2ZWVhZmMwZjg2N2ZlMjkyMDY1ZmU4ODo='
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
			power: 'off',
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
		console.debug('turn off lights')
		return turnOffScene(sceneAndLightSettings)

	} else {
		console.debug('turn on scene')
		return turnOnScene(scene)
	}
}

const promise = (
	Promise.resolve()
	.then(getScenes)
	.then(scenes => scenes.find(getScene))
	.then(scene => Promise.all([
		getLightsInScene(scene),
		Promise.resolve(scene),
	]))
	.then(toggleScene)
)
