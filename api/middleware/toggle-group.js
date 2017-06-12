const dir = require(`${global.baseDir}/global-dirs`)
const logger = require(`${dir.api}/logger`)

const POWERED_ON = 1
const DURATION = 500

const toggleGroup = (lifxClient, lifxConfig, groupName) => {
	const lightsInGroup = (
		lifxConfig.groups
		.get(groupName).lights
		.map(({ id }) => lifxClient.light(id))
	)

	const isLightOnInGroup = lightsInGroup.some(({ settings: { power } }) => power === POWERED_ON)

	isLightOnInGroup
	? lightsInGroup.forEach(light => light.off(DURATION))
	: lightsInGroup.forEach(light => light.on(DURATION))
}

module.exports = (lifxClient, lifxConfig) => groupName => {
	logger(`Command: Toggle Light => ${groupName}`)

	lifxClient.update()

	setTimeout(() => toggleGroup(lifxClient, lifxConfig, groupName), 250)

	setTimeout(() => {
		lifxClient.update()
		lifxConfig.update()
	}, DURATION + 250)
}
