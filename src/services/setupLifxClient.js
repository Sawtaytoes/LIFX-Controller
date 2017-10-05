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
	Promise.promisify(light.getState, { context: light })()
	.then(addLightSettings(light))
)

const update = lights => (
	Promise.all(
		lights
		.filter(isLightOnline)
		.map(updateLightConfig)
	)
)

lifxClient.on('light-new', updateLightConfig)
lifxClient.update = update

module.exports = lifxClient
