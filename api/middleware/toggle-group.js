const dir = require(`${global.baseDir}/global-dirs`)
const logger = require(`${dir.utils}/logger`)

const POWERED_ON = 1
const DURATION = 500

const isLightOnInGroup = lightsInGroup => (
	lightsInGroup.some(({ settings: { power } }) => power === POWERED_ON)
)

const changeLightPower = powerFuncName => light => (
	new Promise((resolve, reject) => (
		light[powerFuncName](DURATION, err => err ? reject(err) : resolve())
	))
)

const turnOffLight = changeLightPower('off')
const turnOnLight = changeLightPower('on')

const toggleGroup = lightsInGroup => {
	Promise.all(
		isLightOnInGroup(lightsInGroup)
		? lightsInGroup.map(turnOffLight)
		: lightsInGroup.map(turnOnLight)
	)
}

module.exports = (lifxClient, lifxConfig) => groupName => {
	logger(`Command: Toggle Light => ${groupName}`)

	const lightsInGroup = (
		lifxConfig.groups
		.get(groupName).lights
		.map(({ id }) => lifxClient.light(id))
	)

	lifxClient.update(lightsInGroup)
	.then(toggleGroup)
	.then(lifxConfig.update)
	.catch(err => console.error(err))
}
