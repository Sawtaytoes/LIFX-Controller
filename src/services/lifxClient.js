const LifxClient = require('node-lifx').Client
const Promise = require('bluebird')

const lifxClient = new LifxClient()

const isLightOnline = Boolean

const addLightSettings = light => state => {
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
	Promise
	.promisify(light.getState, { context: light })()
	.then(addLightSettings(light))
	.catch(console.error)
)

const update = lights => (
	Promise
	.all(
		lights
		.filter(isLightOnline)
		.map(updateLightConfig)
	)
	.then(lights => (
		lights
		.filter(Boolean)
	))
)

lifxClient.on('light-new', updateLightConfig)
lifxClient.on('light-offline', updateLightConfig)
lifxClient.on('light-online', updateLightConfig)
lifxClient.update = update

module.exports = lifxClient
