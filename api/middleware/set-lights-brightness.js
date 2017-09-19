const Promise = require('bluebird')

const dir = require(`${global.baseDir}/global-dirs`)
const logger = require(`${dir.utils}/logger`)

const DURATION = 500

const isLightOnline = Boolean
const getLightByName = lifxClient => name => lifxClient.light(name)

const changeLightBrightness = ({ newBrightness, light }) => (
	Promise.promisify(light.color, { context: light })(
		light.settings.color.hue,
		light.settings.color.saturation,
		newBrightness,
		light.settings.color.kelvin,
		DURATION
	)
)

const changeLightPower = powerFuncName => ({ light }) => (
	Promise.promisify(light[powerFuncName], { context: light })(DURATION)
)

const getNewBrightnessValuesForLights = lightsConfig => lights => (
	lights
	.map(light => ({
		newBrightness: Number(
			lightsConfig
			.find(({ lightName }) => lightName === light.label)
			.brightness
		),
		light,
	}))
)

const turnOnLight = changeLightPower('on')

const setLightsBrightness = lights => (
	Promise.all(
		lights
		.map(changeLightBrightness)
		.concat(
			Promise.all(
				lights.map(turnOnLight)
			)
		)
	)
)

module.exports = (lifxClient, lifxConfig) => lightsConfig => {
	const lightNames = lightsConfig.map(({ lightName }) => lightName)

	logger.log(`Command: Set Light Brightness => ${lightNames.join(', ')}`)

	const lights = (
		lightNames
		.map(getLightByName(lifxClient))
		.filter(isLightOnline)
	)

	if (!lights.length) return 'Lights do not exist.'

	lifxClient.update(lights)
	.then(getNewBrightnessValuesForLights(lightsConfig))
	.then(setLightsBrightness)
	.then(lifxConfig.update)
	.catch(logger.logError)
}
