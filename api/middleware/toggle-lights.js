const Promise = require('bluebird')
const Rx = require('rxjs/Rx')

const dir = require(`${global.baseDir}/global-dirs`)
const lifxClient = require(`${dir.services}setup-lifx-client`)
const lifxConfig = require(`${dir.services}setup-lifx-config`)
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

module.exports = lightNames => {
	const lights$ = (
		Rx.Observable
		.of(lightNames)
		.do(lightNames => (
			logger.log(`Command: Toggle Light => ${lightNames.join(', ')}`)
		))
		.map(lightNames => (
			lightNames
			.map(getLightByName(lifxClient))
			.filter(isLightOnline)
		))
		.do(lights => !lights.length && logger.logError("Lights do not exist"))
		.filter(lights => lights.length > 0)
		.map(lifxClient.update)
		.map(toggleLights)
		.map(lifxConfig.update)
	)

	lights$
	.subscribe(
		logger.log,
		logger.logError
	)
}
