const Rx = require('rxjs/Rx')

const dir = require(`${global.baseDir}directories`)
const createObserverCallback = require(`${dir.utils}createObserverCallback`)
const lifxClient = require(`${dir.services}lifxClient`)
const lifxConfig = require(`${dir.services}lifxConfig`)
const logger = require(`${dir.utils}logger`)

const { addObserver, triggerObservable } = createObserverCallback()

const POWERED_ON = 1
const DURATION = 0

const getLightByName = lifxClient => name => lifxClient.light(name)

const isOneOrMoreLightsOn = lights => (
	lights.some(({ settings: { power } }) => power === POWERED_ON)
)

const changeLightPower = powerFuncName => light => (
	Rx.Observable
	.bindCallback(light[powerFuncName])
	.call(light, DURATION)
)

const turnOffLight = changeLightPower('off')
const turnOnLight = changeLightPower('on')

const toggleLights = lights => (
	isOneOrMoreLightsOn(lights)
	? lights.map(turnOffLight)
	: lights.map(turnOnLight)
)

Rx.Observable
.fromEventPattern(addObserver)
.do(lightNames => (
	logger.log(`Command: Toggle Light => ${lightNames.join(', ')}`)
))
.map(lightNames => (
	lightNames
	.map(getLightByName(lifxClient))
	.filter(Boolean)
))
.do(lights => (
	!lights.length
	&& logger.logError("Lights do not exist")
))
.filter(lights => lights.length > 0)
.map(lifxClient.update)
.mergeAll()
.switchMap(toggleLights)
.mergeAll()
.do(lifxConfig.update)
.subscribe({ error: logger.logError })

module.exports = triggerObservable
