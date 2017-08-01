const Promise = require('bluebird')

const dir = require(`${global.baseDir}/global-dirs`)
const logger = require(`${dir.utils}/logger`)

const POWERED_ON = 1
const DURATION = 500

const isLightOnline = Boolean
const getLightByName = lifxClient => name => lifxClient.light(name)

const isOneOrMoreLightsOn = lights => (
	lights.some(({ settings: { power } }) => power === POWERED_ON)
)

const changeLightPower = powerFuncName => light => (
	Promise.promisify(light[powerFuncName], { context: light })(DURATION)
)

const turnOffLight = changeLightPower('off')
const turnOnLight = changeLightPower('on')

const toggleLights = lights => (
	Promise.all(
		isOneOrMoreLightsOn(lights)
		? lights.map(turnOffLight)
		: lights.map(turnOnLight)
	)
)

module.exports = (lifxClient, lifxConfig) => lightNames => {
	logger.log(`Command: Toggle Light => ${lightNames.join(', ')}`)

	const lights = (
		lightNames
		.map(getLightByName(lifxClient))
		.filter(isLightOnline)
	)

	if (!lights.length) return 'Lights do not exist.'

	lifxClient.update(lights)
	.then(toggleLights)
	.then(lifxConfig.update)
	.catch(err => logger.logError(err))
}
