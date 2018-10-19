const Promise = require('bluebird')

const dir = require(`${global.baseDir}directories`)
const logger = require(`${dir.utils}logger`)

const POWERED_ON = 1
const DURATION = 0

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

module.exports = (lifxClient, lifxConfig) => groupNames => {
	logger.log(`Command: Toggle Group => ${groupNames.join(', ')}`)

	const groups = (
		groupNames
		.map(groupName => lifxConfig.groups.get(groupName))
	)

	if (!groups || !groups.length) return 'Group does not exist.'

	const lightsInGroups = (
		groups
		.map(group => group.lights)
		.reduce((acc, lights) => acc.concat(lights), [])
		.map(getLightById(lifxClient))
		.filter(Boolean)
	)

	lifxClient.update(lightsInGroups)
	.then(toggleGroup)
	.then(lifxConfig.update)
	.catch(logger.logError)
}
