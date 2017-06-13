const dir = require(`${global.baseDir}/global-dirs`)
const logger = require(`${dir.api}/logger`)

const DURATION = 30000

module.exports = (lifxClient, lifxConfig) => _ => {
	logger('Command: Discover Devices')
	lifxClient.startDiscovery()

	new Promise(resolve => setTimeout(resolve, DURATION))
	.then(() => lifxClient.stopDiscovery())
	.then(lifxConfig.update)
	.then(() => logger('Discover Devices: Complete'))
	.catch(err => console.error('Discover Devices:', err))
}
