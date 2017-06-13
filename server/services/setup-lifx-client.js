const LifxClient = require('node-lifx').Client

const lifxClient = new LifxClient()

const addLightSettings = (light, state) => {
	const {
		color: {
			hue,
			saturation,
			brightness,
			kelvin
		},
		power,
	} = state

	light.settings = {
		brightness,
		color: {
			hue,
			saturation,
			kelvin,
		},
		power,
	}

	return light
}

const updateLightConfig = light => (
	new Promise((resolve, reject) => (
		light.getState((err, state) => (
			err ? reject(err) : resolve(addLightSettings(light, state))
		))
	))
)

const update = lights => (
	Promise.all(lights.map(updateLightConfig))
)

lifxClient.on('light-new', updateLightConfig)
lifxClient.update = update

module.exports = lifxClient
