const Promise = require('bluebird')

const dir = require(`${global.baseDir}/global-dirs`)
const logger = require(`${dir.utils}/logger`)

const POWERED_ON = 1
const DURATION = 500

const isLightOnline = Boolean
const getLightByName = lifxClient => name => lifxClient.light(name)

const isLightOn = lights => (
	lights.some(({ settings: { power } }) => power === POWERED_ON)
)

const changeLightPower = powerFuncName => light => (
	Promise.promisify(light[powerFuncName], { context: light })(DURATION)
)

const turnOffLight = changeLightPower('off')
const turnOnLight = changeLightPower('on')

const toggleLights = lights => (
	Promise.all(
		isLightOn(lights)
		? lights.map(turnOffLight)
		: lights.map(turnOnLight)
	)
)

module.exports = (lifxClient, lifxConfig) => lightNames => {
	logger.log(`Command: Toggle Light => ${lightNames}`)

	const lights = (
		lightNames
		.map(getLightByName(lifxClient))
		.filter(isLightOnline)
	)

	if (!lights.length) return 'Lights do not exist.'

	lifxClient.update(lights)
	.then(toggleLights)
	.then(lifxClient.update)
	.catch(err => logger.logError(err))
}
