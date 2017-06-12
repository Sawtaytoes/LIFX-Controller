const dir = require(`${global.baseDir}/global-dirs`)
const logger = require(`${dir.api}/logger`)

const POWERED_ON = 1
const DURATION = 1000

module.exports = (lifxClient, lifxConfig) => groupName => {
	logger(`Command: Toggle Light => ${groupName}`)

	const lightsInGroup = (
		lifxConfig.groups
		.get(groupName).lights
		.map(({ id }) => lifxClient.light(id))
	)

	const isLightOnInGroup = lightsInGroup.some(({ settings: { power } }) => power === POWERED_ON)

	isLightOnInGroup
	? lightsInGroup.forEach(light => light.off(DURATION))
	: lightsInGroup.forEach(light => light.on(DURATION))

	setTimeout(() => {
		lifxClient.update()
		lifxConfig.update()
	}, DURATION)
}
