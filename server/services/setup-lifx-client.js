const LifxClient = require('node-lifx').Client

const lifxClient = new LifxClient()

const updateLightConfig = light => {
	light.getState((err, state) => {
		if (err) {
			console.error(err)
			return err
		}

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
	})
}

const update = () => lifxClient.lights().forEach(updateLightConfig)

lifxClient.on('light-new', updateLightConfig)
lifxClient.update = update

module.exports = lifxClient
