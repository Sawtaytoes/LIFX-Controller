const Promise = require('bluebird')

const dir = require(`${global.baseDir}/global-dirs`)
const logger = require(`${dir.utils}/logger`)

const POWERED_ON = 1
const DURATION = 500

const isLightOnline = light => light
const getLightById = lifxClient => ({ id }) => lifxClient.light(id)

const isLightOnInGroup = lightsInGroup => (
	lightsInGroup.some(({ settings: { power } }) => power === POWERED_ON)
)

const changeLightPower = powerFuncName => light => (
	Promise.promisify(light[powerFuncName], { context: light })(DURATION)
)

const turnOffLight = changeLightPower('off')
const turnOnLight = changeLightPower('on')

const toggleGroup = lightsInGroup => (
	Promise.all(
		isLightOnInGroup(lightsInGroup)
		? lightsInGroup.map(turnOffLight)
		: lightsInGroup.map(turnOnLight)
	)
)

module.exports = (lifxClient, lifxConfig) => groupName => {
	logger.log(`Command: Toggle Light => ${groupName}`)

	const group = lifxConfig.groups.get(groupName)

	if (!group) return 'Group does not exist.'

	const lightsInGroup = (
		group.lights
		.map(getLightById(lifxClient))
		.filter(isLightOnline)
	)

	lifxClient.update(lightsInGroup)
	.then(toggleGroup)
	.then(lifxClient.update)
	.catch(err => logger.logError(err))
}
